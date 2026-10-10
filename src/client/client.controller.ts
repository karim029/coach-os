import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import type { Request } from 'express'
@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createClient(@Req() req: Request ,@Body() dto: CreateClientDto){
        if(!req.user){
            throw new UnauthorizedException('Not Authorized');
        }
        const coachId = req.user.id
        return this.clientService.createClient(dto, coachId)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getClients(@Req() req: Request){
        if(!req.user){
            throw new UnauthorizedException()
        }
        return this.clientService.findAllClientsForCoach(req.user.id)
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getClient(@Req() req: Request,@Param('id') id: string ){
        if(!req.user){
            throw new UnauthorizedException()
        }
        return this.clientService.findClientById(id, req.user.id)
    }


}
