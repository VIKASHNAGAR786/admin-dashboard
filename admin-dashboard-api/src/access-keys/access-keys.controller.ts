import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AccessKeysService } from './access-keys.service';
import { GenerateAccessKeyDto, ValidateAccessKeyDto } from './dto/access-key.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('access-keys')
@UseGuards(JwtAuthGuard)
export class AccessKeysController {
  constructor(private accessKeysService: AccessKeysService) {}

  /**
   * LIVE TRACKING DATA
   * Simplified URL: api/access-keys/live-tracking
   */
  @Get('live-tracking')
  async fetchGoogleData() {
    try {
      console.log('Fetching live tracking data from Google Sheets...');
      return await this.accessKeysService.fetchGoogleSheetData();
    } catch (error) {
      console.error('Error fetching Google data:', error);
      throw new InternalServerErrorException('Failed to fetch tracking data from Google');
    }
  }

  @Post()
  async generate(@Body() generateDto: GenerateAccessKeyDto) {
    try {
      if (!generateDto.clientId) {
        throw new BadRequestException('clientId is required');
      }
      if (!generateDto.expirationDate) {
        throw new BadRequestException('expirationDate is required');
      }
      const existingKey = await this.accessKeysService.checkExistingValidKey(generateDto.clientId);
      if (existingKey) {
        return {
          alreadyExists: true,
          existingKey,
          message: `Client already has an active access key`,
        };
      }
      return await this.accessKeysService.generate(generateDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to generate access key');
    }
  }

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return await this.accessKeysService.findAll(page, limit);
  }

  @Get('validate/:key')
  async validateKey(
    @Param('key') key: string,
    @Query('deviceId') deviceId?: string,
    @Query('ip') ip?: string,
  ) {
    try {
      return await this.accessKeysService.validateKey(key, deviceId, ip);
    } catch (error) {
      console.error('Error validating key:', error);
      throw new InternalServerErrorException('Failed to validate key');
    }
  }

  @Get('client/:clientId')
  async getByClient(@Param('clientId') clientId: string) {
    return await this.accessKeysService.getByClientId(clientId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.accessKeysService.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'Failed to fetch access key');
    }
  }

  @Delete(':id')
  async revoke(@Param('id') id: string) {
    try {
      await this.accessKeysService.revoke(id);
      return { message: 'Access key revoked successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to revoke access key');
    }
  }
}
