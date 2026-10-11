import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePackageDto } from './dto/create-package.dto.js';

@Injectable()
export class PackageService {
    constructor(private readonly prismaService: PrismaService){}

    async createPackage(coachId: string, createPackageDto: CreatePackageDto){

        const normalizedName = createPackageDto.name.trim().toLowerCase()
        try {
            const pkg = await this.prismaService.package.create({
                data: {...createPackageDto,name: normalizedName, coachId: coachId}
            })
            return pkg
        } catch (error: any) {
            if(error.code === 'P2002'){
                throw new ConflictException('A package with this name already exists')
            }
            throw error
        }

    }

    async findAllPackagesForCoach(coachId: string){

        const packages = await this.prismaService.package.findMany({where: {
            coachId: coachId, isActive: true
        }})

        return packages
    }
    async findPackageById(packageId: string, coachId: string){
        try{

            const pkg = await this.prismaService.package.findFirstOrThrow({where: {
                id:packageId, coachId: coachId, isActive: true
            }})
            return pkg
        }catch(error: any){
            if(error.code === 'P2025'){
                throw new NotFoundException('No package found')
            }
            throw error
        }
    }

    async deletePackage(packageId: string, coachId: string){
        const result = await this.prismaService.package.updateMany({
            where: {
                id: packageId, coachId: coachId
            },
            data: {
                isActive: false
            }
        })
        if(result.count === 0){
            throw new NotFoundException('Package not found')
        }

        const archivedPackage = await this.prismaService.package.findUnique({
            where: {
                id: packageId
            }
        })
        return archivedPackage
    }
}

