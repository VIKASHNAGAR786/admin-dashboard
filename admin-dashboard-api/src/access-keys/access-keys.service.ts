import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessKey } from './entities/access-key.entity';
import { GenerateAccessKeyDto } from './dto/access-key.dto';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Client } from '../clients/entities/client.entity';
import { googleConfig } from '../config/database.config';

@Injectable()
export class AccessKeysService {
  constructor(
    @InjectRepository(AccessKey)
    private accessKeysRepository: Repository<AccessKey>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    private jwtService: JwtService,
  ) {}

  async checkExistingValidKey(clientId: string): Promise<AccessKey | null> {
    try {
      const existingKey = await this.accessKeysRepository.findOne({
        where: { clientId, status: 'active' },
        order: { createdAt: 'DESC' },
      });
      if (!existingKey) return null;
      if (existingKey.expirationDate && new Date(existingKey.expirationDate) < new Date()) {
        await this.accessKeysRepository.update(existingKey.id, { status: 'expired' });
        return null;
      }
      return existingKey;
    } catch (error) {
      return null;
    }
  }

  async generate(generateDto: GenerateAccessKeyDto): Promise<AccessKey> {
    const client = await this.clientsRepository.findOne({ where: { id: generateDto.clientId } });
    if (!client) throw new Error('Client not found');

    let expirationDate: Date | null = null;
    let expiresInSeconds: number | undefined = undefined;
    if (generateDto.expirationDate) {
      expirationDate = new Date(generateDto.expirationDate);
      expiresInSeconds = Math.floor((expirationDate.getTime() - Date.now()) / 1000);
    }

    const extractedIds = this.extractModuleIds(generateDto.modules || []);

    const payload = {
      jti: uuid(),
      clientId: client.id,
      companyName: client.companyName,
      email: client.email,
      allowedModuleIds: extractedIds.join(','),
      modules: extractedIds,
      expirationDate: expirationDate,
      createdAt: new Date().toISOString(),
    };

    const key = this.jwtService.sign(payload, expiresInSeconds && expiresInSeconds > 0 ? { expiresIn: expiresInSeconds } : {});

    const accessKey = this.accessKeysRepository.create({
      key,
      clientId: generateDto.clientId,
      modules: generateDto.modules || [],
      expirationDate,
      status: 'active',
    });

    const savedKey = await this.accessKeysRepository.save(accessKey);
    
    // Sync immediately (Async)
    this.syncToGoogleSheets(savedKey, 'CREATE', client).catch(() => {});

    return savedKey;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [keys, total] = await this.accessKeysRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['client'],
    });
    return { data: keys, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<AccessKey> {
    const key = await this.accessKeysRepository.findOne({ where: { id }, relations: ['client'] });
    if (!key) throw new Error(`Access key not found`);
    return key;
  }

  async validateKey(key: string, deviceId?: string, ipAddress?: string) {
    const accessKey = await this.accessKeysRepository.findOne({
      where: { key, status: 'active' },
      relations: ['client'],
    });

    if (!accessKey) return { valid: false, message: 'Invalid or inactive key' };

    if (accessKey.expirationDate && new Date(accessKey.expirationDate) < new Date()) {
      return { valid: false, message: 'Key has expired' };
    }

    if (deviceId) {
      if (!accessKey.deviceId) {
        accessKey.deviceId = deviceId;
      } else if (accessKey.deviceId !== deviceId) {
        return { valid: false, message: 'Access Denied: Registered to another device.' };
      }
    }

    accessKey.lastUsed = new Date();
    accessKey.usageCount = (accessKey.usageCount || 0) + 1;
    if (ipAddress) accessKey.lastIp = ipAddress;

    const updatedKey = await this.accessKeysRepository.save(accessKey);

    // Sync usage immediately
    this.syncToGoogleSheets(updatedKey, 'VALIDATE', updatedKey.client).catch(() => {});

    return { valid: true, key: updatedKey, client: updatedKey.client, modules: updatedKey.modules };
  }

  private async syncToGoogleSheets(accessKey: AccessKey, action: string, clientInfo?: any) {
    try {
      if (!googleConfig.webhookUrl) return;

      const payload = {
        action,
        id: accessKey.id,
        key: accessKey.key,
        clientId: accessKey.clientId,
        companyName: clientInfo?.companyName || 'Unknown',
        email: clientInfo?.email || 'Unknown',
        deviceId: accessKey.deviceId || 'Not Registered',
        lastIp: accessKey.lastIp || 'N/A',
        usageCount: accessKey.usageCount || 0,
        status: accessKey.status,
        expirationDate: accessKey.expirationDate,
        lastUsed: accessKey.lastUsed,
        timestamp: new Date().toISOString(),
      };

      // Use fire-and-forget approach for speed
      fetch(googleConfig.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
      
    } catch (error) {
      // Fail silently to not block the main app
    }
  }

  async fetchGoogleSheetData() {
    try {
      const response = await fetch(googleConfig.webhookUrl + '?action=FETCH');
      return await response.json();
    } catch (error) {
      throw new Error('Could not fetch tracking data');
    }
  }

  async revoke(id: string): Promise<void> {
    const key = await this.findOne(id);
    await this.accessKeysRepository.update(id, { status: 'revoked' });
    key.status = 'revoked';
    // Send to Google Sheet as DEACTIVATED
    this.syncToGoogleSheets(key, 'DEACTIVATED', key.client).catch(() => {});
  }

  async getByClientId(clientId: string) {
    return this.accessKeysRepository.find({
      where: { clientId },
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByClientId(clientId: string, status?: string) {
    const where: any = { clientId };
    if (status) where.status = status;
    return this.accessKeysRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async countByClientId(clientId: string): Promise<number> {
    return this.accessKeysRepository.count({ where: { clientId } });
  }

  private extractModuleIds(modules: any[]): number[] {
    const ids: number[] = [];
    const traverse = (nodes: any[]) => {
      if (!nodes || !Array.isArray(nodes)) return;
      for (const node of nodes) {
        if (node && typeof node === 'object' && 'id' in node) {
          const idVal = Number(node.id);
          if (!isNaN(idVal)) {
            ids.push(idVal);
          }
        } else if (typeof node === 'number') {
          ids.push(node);
        } else if (typeof node === 'string') {
          const idVal = Number(node);
          if (!isNaN(idVal)) {
            ids.push(idVal);
          }
        }
        if (node && typeof node === 'object' && node.children) {
          traverse(node.children);
        }
      }
    };
    traverse(modules);
    return Array.from(new Set(ids)).sort((a, b) => a - b);
  }
}
