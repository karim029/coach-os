import { Module } from '@nestjs/common';
import { ClientController } from './client.controller.js';
import { ClientService } from './client.service.js';
import { JwtConfigModule } from '../jwt/jwt-config.module.js';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
  imports: [JwtConfigModule]
})
export class ClientModule {}
