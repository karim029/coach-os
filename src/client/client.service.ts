import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';

@Injectable()
export class ClientService {

    constructor(private readonly prismaService: PrismaService){}

    async createClient(createClientDto: CreateClientDto, coachId: string){
        const normalizedPhone = createClientDto.phone.trim();
        const existing = await this.prismaService.client.findFirst({
            where: {
                phone: normalizedPhone,
                coachId: coachId
            }
        })

        if(existing){
            throw new ConflictException('Client already exists')
        }

        const client = await this.prismaService.client.create({data: {
            name: createClientDto.name,
            phone: normalizedPhone,
            email: createClientDto.email?.trim(),
            coachId: coachId

        }})

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
}
