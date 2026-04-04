import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessKey } from './entities/access-key.entity';
import { GenerateAccessKeyDto } from './dto/access-key.dto';
import { v4 as uuid } from 'uuid';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { Client } from '../clients/entities/client.entity';

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
        where: {
          clientId,
          status: 'active',
        },
        order: { createdAt: 'DESC' },
      });

      if (!existingKey) {
        return null;
      }

      // Check if key is expired
      if (existingKey.expirationDate && new Date(existingKey.expirationDate) < new Date()) {
        // Mark as expired
        await this.accessKeysRepository.update(existingKey.id, { status: 'expired' });
        return null;
      }

      return existingKey;
    } catch (error) {
      console.error('Error checking existing key:', error);
      return null;
    }
  }

  async generate(generateDto: GenerateAccessKeyDto): Promise<AccessKey> {
    try {
      const client = await this.clientsRepository.findOne({ where: { id: generateDto.clientId } });
      if (!client) {
        throw new Error('Client not found');
      }

      // Ensure expiration date is a valid Date object
      let expirationDate: Date | null = null;
      let expiresInSeconds: number | undefined = undefined;
      if (generateDto.expirationDate) {
        if (typeof generateDto.expirationDate === 'string') {
          expirationDate = new Date(generateDto.expirationDate);
        } else if (generateDto.expirationDate instanceof Date) {
          expirationDate = generateDto.expirationDate;
        }
        
        if (isNaN(expirationDate.getTime())) {
          throw new Error('Invalid expiration date format');
        }
        expiresInSeconds = Math.floor((expirationDate.getTime() - Date.now()) / 1000);
      }

      const payload = {
        jti: uuid(),
        clientId: client.id,
        companyName: client.companyName,
        email: client.email,
        contactPerson: client.contactPerson,
        modules: generateDto.modules || [],
        expirationDate: expirationDate,
        createdAt: new Date().toISOString(),
      };

      const signOptions: any = {};
      if (expiresInSeconds && expiresInSeconds > 0) {
        signOptions.expiresIn = expiresInSeconds;
      }
      
      const key = this.jwtService.sign(payload, signOptions);

      console.log('Creating access key with:', {
        key,
        clientId: generateDto.clientId,
        modules: generateDto.modules,
        expirationDate,
      });

      const accessKey = this.accessKeysRepository.create({
        key,
        clientId: generateDto.clientId,
        modules: generateDto.modules || [],
        expirationDate,
        status: 'active',
      });

      console.log('Access key entity created:', accessKey);
      const savedKey = await this.accessKeysRepository.save(accessKey);
      console.log('Access key saved to database:', savedKey);

      return savedKey;
    } catch (error) {
      console.error('Error in generate service method:', error);
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [keys, total] = await this.accessKeysRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['client'],
    });

    return {
      data: keys,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<AccessKey> {
    try {
      const key = await this.accessKeysRepository.findOne({ 
        where: { id },
        relations: ['client'],
      });
      if (!key) {
        throw new Error(`Access key with ID ${id} not found`);
      }
      return key;
    } catch (error) {
      console.error('Error finding access key:', error);
      throw error;
    }
  }

  async validateKey(key: string) {
    const accessKey = await this.accessKeysRepository.findOne({
      where: { key, status: 'active' },
      relations: ['client'],
    });

    if (!accessKey) {
      return { valid: false, message: 'Invalid or inactive key' };
    }

    // Check expiration
    if (accessKey.expirationDate && new Date(accessKey.expirationDate) < new Date()) {
      return { valid: false, message: 'Key has expired' };
    }

    // Update last used
    await this.accessKeysRepository.update(accessKey.id, { lastUsed: new Date() });

    return {
      valid: true,
      key: accessKey,
      client: accessKey.client,
      modules: accessKey.modules,
    };
  }

  async revoke(id: string): Promise<void> {
    await this.findOne(id);
    await this.accessKeysRepository.update(id, { status: 'revoked' });
  }

  async getByClientId(clientId: string) {
    return this.accessKeysRepository.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
  }

  async findByClientId(clientId: string, status?: string) {
    const whereClause: any = { clientId };
    if (status) {
      whereClause.status = status;
    }
    
    return this.accessKeysRepository.find({
      where: whereClause,
      order: { createdAt: 'DESC' },
    });
  }

  async countByClientId(clientId: string): Promise<number> {
    return this.accessKeysRepository.count({ where: { clientId } });
  }
}
