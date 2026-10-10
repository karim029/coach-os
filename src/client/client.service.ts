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
        const clientsData = await this.prismaService.client.findMany({where: {coachId: coachId}})
        const safeClients = clientsData.map(({passwordHash,...rest})=> rest)
        return safeClients
    }



}
