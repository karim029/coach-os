import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterCoachDto } from '../coach/dto/RegisterCoachDto.js';
import { CoachService } from '../coach/coach.service.js';
import { SignInDto } from './dto/SignInDto.js';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard.js';
import type { Request } from 'express';
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly coachService: CoachService
    ){}

    @Post('coach/register')
    async coachRegister(@Body() dto: RegisterCoachDto){
        const coach = await this.coachService.registerCoach(dto)
        return coach
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('coach/sign-in')
    async coachSignIn(@Body() dto:SignInDto){
        const result = await this.authService.signInCoach(dto)
        return result
    }
}
