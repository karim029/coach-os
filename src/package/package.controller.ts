import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { CreatePackageDto } from './dto/create-package.dto.js';
import type { Request } from 'express'
import { PackageService } from './package.service.js';

@Controller('package')
export class PackageController {
    constructor(private readonly packageService: PackageService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPackage(@Req() req: Request, @Body() dto: CreatePackageDto){
        
        if(!req.user){
            throw new UnauthorizedException()
        }
        return await this.packageService.createPackage(req.user.id, dto)

    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllPackagesForCoach(@Req() req: Request){
        if(!req.user){
            throw new UnauthorizedException()
        }
        return await this.packageService.findAllPackagesForCoach(req.user.id)
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getPackage(@Req() req: Request,@Param('id') packageId: string){
        if(!req.user){
            throw new UnauthorizedException()
        }
        return await this.packageService.findPackageById(packageId,req.user.id)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deletePackage(@Req() req: Request, @Param('id') packageId: string){
        if(!req.user){
            throw new UnauthorizedException()
        }
        return await this.packageService.deletePackage(packageId, req.user.id)
    }
}
