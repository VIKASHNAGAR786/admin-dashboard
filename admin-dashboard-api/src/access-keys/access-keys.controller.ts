import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AccessKeysService } from './access-keys.service';
import { GenerateAccessKeyDto, ValidateAccessKeyDto } from './dto/access-key.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('access-keys')
@UseGuards(JwtAuthGuard)
export class AccessKeysController {
  constructor(private accessKeysService: AccessKeysService) {}

  @Post()
  generate(@Body() generateDto: GenerateAccessKeyDto) {
    return this.accessKeysService.generate(generateDto);
  }

  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.accessKeysService.findAll(page, limit);
  }

  @Get('client/:clientId')
  getByClient(@Param('clientId') clientId: string) {
    return this.accessKeysService.getByClientId(clientId);
  }

  @Get('validate/:key')
  validateKey(@Param('key') key: string) {
    return this.accessKeysService.validateKey(key);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessKeysService.findOne(id);
  }

  @Delete(':id')
  revoke(@Param('id') id: string) {
    return this.accessKeysService.revoke(id);
  }
}
