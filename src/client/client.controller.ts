import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import type { Request } from 'express'
import { ActivateClientDto } from './dto/activate-client.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/decorators/current-user.decorator.js';


@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createClient(@CurrentUser() user: AuthUser ,@Body() dto: CreateClientDto){
       
        return this.clientService.createClient(dto, user.id)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getClients(@CurrentUser() user: AuthUser){
       
        return this.clientService.findAllClientsForCoach(user.id)
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getClient(@CurrentUser() user: AuthUser,@Param('id') id: string ){
        
        return this.clientService.findClientById(id,user.id)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteClient(@CurrentUser() user: AuthUser, @Param('id') id: string){
        
        return this.clientService.deleteClient(id, user.id)
    }

    @Post('activate/:token')
    async activateClient(@Param('token') token: string, @Body() activateclientDto: ActivateClientDto){
        return this.clientService.activateClient(token, activateclientDto)
    }

}
