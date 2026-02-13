import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';
import { AccessKey } from '@/access-keys/entities/access-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, AccessKey])],
  providers: [ClientsService],
  controllers: [ClientsController],
  exports: [ClientsService],
})

export class ClientsModule {}
