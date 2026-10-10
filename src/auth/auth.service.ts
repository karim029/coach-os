import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CoachService } from '../coach/coach.service.js';
import { SignInDto } from './dto/SignInDto.js';
import * as bcrypt from 'bcryptjs';
import { ClientService } from '../client/client.service.js';

@Injectable()
export class AuthService {
    constructor(private readonly coachService: CoachService,
         private readonly jwtService: JwtService,
         private readonly clientService: ClientService
        ){}
    
    async signInCoach(signInDto: SignInDto){

        const existing = await this.coachService.findCoachByEmail(signInDto.email.toLowerCase().trim())
        if(!existing){
            throw new UnauthorizedException('Invalid email or password')
        }

        const isPassMatch = await bcrypt.compare(signInDto.password,existing.passwordHash)
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

    async signInClient(signInDto: SignInDto){
        const existing = await this.clientService.findClientByEmail(signInDto.email)
        if(!existing){
            throw new UnauthorizedException('Invalid email or password')
        }
        const isPassMatch = await bcrypt.compare(signInDto.password, existing.passwordHash!)
        if(!isPassMatch){
            throw new UnauthorizedException('Invalid email or password')
        }
        const payload = {sub: existing.id, email: existing.email, role: 'CLIENT'}
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
