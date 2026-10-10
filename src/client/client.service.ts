import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { JwtService } from '@nestjs/jwt';
import { ActivateClientDto } from './dto/activate-client.dto.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class ClientService {
    private readonly saltRounds = 10

    constructor(private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ){}

    async createClient(createClientDto: CreateClientDto, coachId: string){
        const normalizedPhone = createClientDto.phone.trim()
        const normalizedEmail = createClientDto.email?.trim().toLowerCase();
        const phoneConflict = await this.prismaService.client.findFirst({
            where: { phone: normalizedPhone, coachId: coachId }
        });
        if (phoneConflict) {
        throw new ConflictException('A client with this phone number already exists for you');
        }
        if (normalizedEmail) {
            const emailConflict = await this.prismaService.client.findFirst({
                where: { email: normalizedEmail }
            });
            if (emailConflict) {
                throw new ConflictException('This email is already registered to a client');
            }
        }
        
        const client = await this.prismaService.client.create({data: {
            name: createClientDto.name,
            phone: normalizedPhone,
            email: normalizedEmail,
            coachId: coachId,
        }})
        const payload = {clientId: client.id}
        const activationToken = await this.jwtService.signAsync(payload,{
            expiresIn: '72h'
        })
        await this.prismaService.client.update({where:{
            id: client.id,
            
        },data: {
            activationToken: activationToken
        }
    })
         client.activationToken = activationToken

        return client
    }

    async findAllClientsForCoach(coachId: string){
        const clientsData = await this.prismaService.client.findMany({where: {coachId: coachId, status: {not: 'archived'}}})
        const safeClients = clientsData.map(({passwordHash,...rest})=> rest)
        return safeClients
    }


    async findClientById(clientId: string, coachId: string){
        const exist = await this.prismaService.client.findFirst({where:{
            AND: [
                {id: clientId},
                {coachId: coachId}
            ]
        }})

        if(!exist){
            throw new NotFoundException('User not found')
        }

        const {passwordHash, ...safeClient} = exist
        return safeClient
    }

    async findClientByEmail(email: string){
        return await this.prismaService.client.findUnique({
            where: {email: email}
        })
    }

    async deleteClient(clientId: string, coachId: string){

        const result = await this.prismaService.client.updateMany({
            where: {id: clientId,coachId: coachId},
            data: {status: 'archived'}
        })

        if(result.count === 0){
            throw new NotFoundException('Client not found')
        }

        const archivedClient = await this.prismaService.client.findUnique({where: {id: clientId}})

        const {passwordHash, ...safeClient} = archivedClient!
        return safeClient

    }


    async activateClient(activationToken: string, activateClientDto: ActivateClientDto){
        let payload
        try {
            payload = await this.jwtService.verifyAsync(activationToken)
        } catch (error: any) {
            if(error.name === 'TokenExpiredError'){
                throw new UnauthorizedException('Activation link has expired. Please request a new one')
            }
            throw new UnauthorizedException(`Invalid activation token. error: ${error.name}`)
        }
        const {clientId} = payload
        const client = await this.prismaService.client.findUnique({where: {
            id: clientId
        }})
        if(!client){
            throw new BadRequestException('Client not found')
        }
        if(client.status !== 'invited'){
            throw new BadRequestException('Client already activated')
        }
        const hashedPassword = await bcrypt.hash(activateClientDto.password,this.saltRounds)
        
        if(!client.email && !activateClientDto.email){
            throw new BadRequestException('Email is required to activate your account')
        }
        const finalEmail = client.email ?? activateClientDto.email.trim().toLowerCase()
      
        const {passwordHash, ...safeClient} = await this.prismaService.client.update({
            where: {id: clientId},
            data: {
                email: finalEmail,
                status: 'active',
                passwordHash: hashedPassword,
                activationToken: null
            }
        })
        return safeClient

    }
}
