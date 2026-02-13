import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessKey } from './entities/access-key.entity';
import { GenerateAccessKeyDto } from './dto/access-key.dto';
import { v4 as uuid } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class AccessKeysService {
  constructor(
    @InjectRepository(AccessKey)
    private accessKeysRepository: Repository<AccessKey>,
  ) {}

  async generate(generateDto: GenerateAccessKeyDto): Promise<AccessKey> {
    // Generate unique key format: PREFIX-RANDOM-UNIQUE
    const key = `AK_${uuid().replace(/-/g, '').toUpperCase().slice(0, 20)}_${Date.now().toString(36).toUpperCase()}`;

    const accessKey = this.accessKeysRepository.create({
      key,
      clientId: generateDto.clientId,
      modules: generateDto.modules || [],
      expirationDate: generateDto.expirationDate,
      status: 'active',
    });

    return this.accessKeysRepository.save(accessKey);
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
    const key = await this.accessKeysRepository.findOne({ 
      where: { id },
      relations: ['client'],
    });
    if (!key) {
      throw new Error('Access key not found');
    }
    return key;
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

  async countByClientId(clientId: string): Promise<number> {
    return this.accessKeysRepository.count({ where: { clientId } });
  }
}
