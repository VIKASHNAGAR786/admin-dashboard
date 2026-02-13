import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Client } from '../clients/entities/client.entity';
import { ClientsModule } from '../clients/clients.module';
import { AccessKeysModule } from '../access-keys/access-keys.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    ClientsModule,
    AccessKeysModule,
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
