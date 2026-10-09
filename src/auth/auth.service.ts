import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CoachService } from '../coach/coach.service.js';
import { SignInDto } from './dto/SignInDto.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(private readonly coachService: CoachService, private readonly jwtService: JwtService){}
    
    async signInCoach(signIndto: SignInDto){

        const existing = await this.coachService.findCoachByEmail(signIndto.email.toLowerCase().trim())
        if(!existing){
            throw new UnauthorizedException('Invalid email or password')
        }

        const isPassMatch = await bcrypt.compare(signIndto.password,existing.passwordHash)
        if(!isPassMatch){
            throw new UnauthorizedException('Invalid email or password')
        }
        const payload = {sub: existing.id, email: existing.email, role: 'COACH'}
        const accessToken = await this.jwtService.signAsync(payload)

        return {
            accessToken,
            user: {
                id: existing.id,
                name: existing.name,
                email: existing.email
            }
        }

    }
}
