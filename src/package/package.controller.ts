import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { CreatePackageDto } from './dto/create-package.dto.js';
import type { Request } from 'express'
import { PackageService } from './package.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/decorators/current-user.decorator.js';
@Controller('package')
export class PackageController {
    constructor(private readonly packageService: PackageService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createPackage(@CurrentUser() user: AuthUser, @Body() dto: CreatePackageDto){
        return await this.packageService.createPackage(user.id, dto)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllPackagesForCoach(@CurrentUser() user: AuthUser){
        return await this.packageService.findAllPackagesForCoach(user.id)
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getPackage(@CurrentUser() user: AuthUser,@Param('id') packageId: string){
       
        return await this.packageService.findPackageById(packageId,user.id)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deletePackage(@CurrentUser() user: AuthUser, @Param('id') packageId: string){
       
        return await this.packageService.deletePackage(packageId,user.id)
    }
}
