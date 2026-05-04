import { IsString, IsArray, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class GenerateAccessKeyDto {
  @IsUUID()
  clientId: string;

  @IsArray()
  @IsOptional()
  modules?: any[];

  @IsDateString()
  @IsOptional()
  expirationDate?: string | Date;
}

export class ValidateAccessKeyDto {
  @IsString()
  key: string;

  @IsString()
  @IsOptional()
  deviceId?: string;
}

export class AccessKeyResponseDto {
  id: string;
  key: string;
  clientId: string;
  modules: any[];
  deviceId: string;
  lastIp: string;
  usageCount: number;
  expirationDate: Date;
  status: string;
  createdAt: Date;
}
