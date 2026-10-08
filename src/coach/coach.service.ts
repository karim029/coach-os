import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterCoachDto } from './dto/RegisterCoachDto.js';
import * as bcrypt from 'bcryptjs'
@Injectable()
export class CoachService {
    private readonly logger = new Logger(CoachService.name)
    private readonly saltRounds = 10
    constructor(private readonly prisma: PrismaService){}

    async registerCoach(registerCoachDto: RegisterCoachDto){

        const existing = await this.prisma.coach.findFirst({where: {
            OR: [{email: registerCoachDto.email}, {phone: registerCoachDto.phone}]
        }
            
        })
        if(existing?.email === registerCoachDto.email){
            throw new ConflictException('Email already in use')
        }
        if(existing?.phone === registerCoachDto.phone){
            throw new ConflictException('Phone number already in use')
        }

        const hashedPassword = await bcrypt.hash(registerCoachDto.password, this.saltRounds)

        const newCoach = await this.prisma.coach.create({data:{
            name: registerCoachDto.name,
            email: registerCoachDto.email,
            passwordHash: hashedPassword,
            phone: registerCoachDto.phone
        }})

        const {passwordHash, ...safeCoach} = newCoach
        return safeCoach
        
        
    }


}
