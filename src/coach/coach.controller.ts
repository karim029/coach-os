import { Body, Controller, Post } from '@nestjs/common';
import { CoachService } from './coach.service.js';
import { RegisterCoachDto } from './dto/RegisterCoachDto.js';
import { SignInDto } from '../auth/dto/SignInDto.js';
import { AuthService } from '../auth/auth.service.js';

@Controller('coach')
export class CoachController {
    constructor(private readonly coachService: CoachService){}

    
}
