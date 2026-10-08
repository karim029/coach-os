import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { CoachModule } from '../coach/coach.module.js';
import {JwtModule} from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    CoachModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory: async(configService: ConfigService)=>({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {expiresIn: '7d'},
      }),
      inject: [ConfigService],
    })
  ],
  exports: [AuthService]
})
export class AuthModule {}
