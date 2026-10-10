import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { CoachModule } from '../coach/coach.module.js';
import {JwtModule} from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { JwtConfigModule } from '../jwt/jwt-config.module.js';
import { ClientModule } from '../client/client.module.js';
@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    CoachModule,
    JwtConfigModule,
    ClientModule,
  ],
  exports: [AuthService]
})
export class AuthModule {}
