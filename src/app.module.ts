import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { CoachModule } from './coach/coach.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({isGlobal: true}), CoachModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
