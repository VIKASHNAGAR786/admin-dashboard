import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AccessKeysService } from './access-keys.service';
import { GenerateAccessKeyDto, ValidateAccessKeyDto } from './dto/access-key.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('access-keys')
@UseGuards(JwtAuthGuard)
export class AccessKeysController {
  constructor(private accessKeysService: AccessKeysService) {}

  @Post()
  async generate(@Body() generateDto: GenerateAccessKeyDto) {
    try {
      if (!generateDto.clientId) {
        throw new BadRequestException('clientId is required');
      }

      if (!generateDto.expirationDate) {
        throw new BadRequestException('expirationDate is required');
      }

      console.log('Generating access key with DTO:', generateDto);
      
      // Check if client already has an active, non-expired key
      const existingKey = await this.accessKeysService.checkExistingValidKey(generateDto.clientId);
      if (existingKey) {
        console.log('Active key already exists for client:', generateDto.clientId);
        return {
          alreadyExists: true,
          existingKey,
          message: `Client already has an active access key that expires on ${new Date(existingKey.expirationDate).toLocaleDateString()}`,
        };
      }

      const result = await this.accessKeysService.generate(generateDto);
      console.log('Access key generated successfully:', result);
      return {
        alreadyExists: false,
        ...result,
      };
    } catch (error) {
      console.error('Error in generate endpoint:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Failed to generate access key');
    }
  }

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    try {
      return await this.accessKeysService.findAll(page, limit);
    } catch (error) {
      console.error('Error fetching keys:', error);
      throw new InternalServerErrorException('Failed to fetch access keys');
    }
  }

  @Get('client/:clientId')
  async getByClient(@Param('clientId') clientId: string) {
    try {
      return await this.accessKeysService.getByClientId(clientId);
    } catch (error) {
      console.error('Error fetching keys by client:', error);
      throw new InternalServerErrorException('Failed to fetch keys by client');
    }
  }

  @Get('validate/:key')
  async validateKey(@Param('key') key: string) {
    try {
      return await this.accessKeysService.validateKey(key);
    } catch (error) {
      console.error('Error validating key:', error);
      throw new InternalServerErrorException('Failed to validate key');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.accessKeysService.findOne(id);
    } catch (error) {
      console.error('Error fetching key:', error);
      throw new InternalServerErrorException('Failed to fetch access key');
    }
  }

  @Delete(':id')
  async revoke(@Param('id') id: string) {
    try {
      await this.accessKeysService.revoke(id);
      return { message: 'Access key revoked successfully' };
    } catch (error) {
      console.error('Error revoking key:', error);
      throw new InternalServerErrorException('Failed to revoke access key');
    }
  }
}
