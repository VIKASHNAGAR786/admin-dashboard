import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AccessKeysService } from './access-keys.service';
import { AccessKeysController } from './access-keys.controller';
import { AccessKey } from './entities/access-key.entity';
import { Client } from '../clients/entities/client.entity';
import { jwtConfig } from '../config/database.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessKey, Client]),
    JwtModule.register({
      secret: jwtConfig.secret,
    }),
  ],
  providers: [AccessKeysService],
  controllers: [AccessKeysController],
  exports: [AccessKeysService],
})
export class AccessKeysModule {}
