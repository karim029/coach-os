import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterCoachDto } from './dto/RegisterCoachDto.js';
import * as bcrypt from 'bcryptjs'
@Injectable()
export class CoachService {
    private readonly logger = new Logger(CoachService.name)
    private readonly saltRounds = 10
    constructor(private readonly prismaService: PrismaService){}

    async registerCoach(registerCoachDto: RegisterCoachDto){

       const normalizedEmail = registerCoachDto.email.toLowerCase().trim();
       const normalizedPhone = registerCoachDto.phone.trim();

       const existing = await this.prismaService.coach.findFirst({
        where: { OR: [{ email: normalizedEmail }, { phone: normalizedPhone }] }
        })  
        
        if(existing?.email === normalizedEmail){
            throw new ConflictException('Email already in use')
        }
        if(existing?.phone === normalizedPhone){
            throw new ConflictException('Phone number already in use')
        }

        const hashedPassword = await bcrypt.hash(registerCoachDto.password, this.saltRounds)

        const newCoach = await this.prismaService.coach.create({data:{
            name: registerCoachDto.name,
            email: normalizedEmail,
            passwordHash: hashedPassword,
            phone: normalizedPhone
        }})

        const {passwordHash, ...safeCoach} = newCoach
        return safeCoach   
    }

    async findCoachByEmail(email: string){
        return await this.prismaService.coach.findUnique({where: {email: email.trim().toLowerCase()}})
    }


}
