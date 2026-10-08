import { Body, Controller, Post } from '@nestjs/common';
import { CoachService } from './coach.service.js';
import { RegisterCoachDto } from './dto/RegisterCoachDto.js';

@Controller('coach')
export class CoachController {
    constructor(private readonly coachService: CoachService){}

    @Post('register')
    async coachRegister(@Body() dto: RegisterCoachDto){
        const coach = await this.coachService.registerCoach(dto)
        return coach
    }
    
}
