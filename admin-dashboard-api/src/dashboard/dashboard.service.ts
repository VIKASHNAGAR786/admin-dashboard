import { Injectable } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { AccessKeysService } from '../access-keys/access-keys.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../clients/entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    private clientsService: ClientsService,
    private accessKeysService: AccessKeysService,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async getStats() {
    const stats = await this.clientsService.getStats();
    
    // Note: Plan distribution is now tracked in access keys, not clients
    // Clients are just contact records without plan information
    const planDistribution = {};

    // Get total keys generated
    const totalKeys = await this.accessKeysService.findAll(1, 1);

    return {
      totalClients: stats.total,
      activeClients: stats.active,
      expiringClients: stats.expiring,
      planDistribution,
      totalKeysGenerated: totalKeys.total,
      timestamp: new Date(),
    };
  }

  async getSummary(userId: string) {
    const stats = await this.getStats();
    
    return {
      sessionData: {
        totalClients: stats.totalClients,
        apiKeysGenerated: stats.totalKeysGenerated,
        sessionDuration: '24 minutes',
        lastAction: 'Key Generation at ' + new Date().toLocaleTimeString(),
      },
      securityInfo: {
        status: 'Secure',
        message: 'Your session has been securely terminated',
      },
      stats,
    };
  }

  async getRecentActivity() {
    // Get recently created clients
    const recentClients = await this.clientsRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      recentClients,
      timestamp: new Date(),
    };
  }
}
