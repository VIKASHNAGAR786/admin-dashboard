import { IsString, IsArray, IsOptional, IsUUID } from 'class-validator';

export class GenerateAccessKeyDto {
  @IsUUID()
  clientId: string;

  @IsArray()
  @IsOptional()
  modules?: string[];

  @IsOptional()
  expirationDate?: Date;
}

export class ValidateAccessKeyDto {
  @IsString()
  key: string;
}

export class AccessKeyResponseDto {
  id: string;
  key: string;
  clientId: string;
  modules: string[];
  expirationDate: Date;
  status: string;
  createdAt: Date;
}
