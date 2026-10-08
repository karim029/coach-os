import { Module } from '@nestjs/common';
import { CoachController } from './coach.controller.js';
import { CoachService } from './coach.service.js';

@Module({
  controllers: [CoachController],
  providers: [CoachService]
})
export class CoachModule {}
