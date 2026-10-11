import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePackageDto } from './dto/create-package.dto.js';

@Injectable()
export class PackageService {
    constructor(private readonly prismaService: PrismaService){}

    async createPackage(coachId: string, createPackageDto: CreatePackageDto){

        createPackageDto.name.trim().toLowerCase()
        try {
            const pkg = await this.prismaService.package.create({
                data: {...createPackageDto, coachId: coachId}
            })
            return pkg
        } catch (error: any) {
            if(error.code === 'P2002'){
                throw new ConflictException('A package with this name already exists')
            }
            throw error
        }

    }
}
