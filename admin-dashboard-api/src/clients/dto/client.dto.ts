import { IsString, IsEmail, IsOptional, IsDate, IsArray } from 'class-validator';

export class CreateClientDto {
  @IsString()
  companyName: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  contactNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  plan?: string;

  @IsOptional()
  startDate?: Date;

  @IsOptional()
  expirationDate?: Date;

  @IsArray()
  @IsOptional()
  modules?: string[];
}

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  @IsOptional()
  contactNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  plan?: string;

  @IsOptional()
  expirationDate?: Date;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  modules?: string[];
}

export class ClientResponseDto {
  id: string;
  companyName: string;
  email: string;
  contactPerson: string;
  contactNumber: string;
  address: string;
  plan: string;
  startDate: Date;
  expirationDate: Date;
  status: string;
  modules: string[];
  createdAt: Date;
  updatedAt: Date;
}
