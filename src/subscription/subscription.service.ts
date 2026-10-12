import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';

@Injectable()
export class SubscriptionService {
    constructor(private readonly prismaService: PrismaService){}

    async createSubscription(coachId: string, createSubscriptionDto: CreateSubscriptionDto){
        const existingClient = await this.prismaService.client.findFirst({
            where: {
                id: createSubscriptionDto.clientId, coachId: coachId
            }
        })
        if(!existingClient){
            throw new NotFoundException('Client not found')
        }
        if(existingClient.status === 'archived'){
            throw new UnauthorizedException('Client is removed, unarchive or add a new client')
        }
        const existingPackage = await this.prismaService.package.findFirst({
            where: {
                coachId: coachId, id: createSubscriptionDto.packageId
            }
        })
        if(!existingPackage){
            throw new NotFoundException("Package not found")
        }
        if(existingPackage.isActive === false){
            throw new UnauthorizedException('Package is not active')
        }
        const activeSubscription = await this.prismaService.subscription.findFirst({
        where: { clientId: createSubscriptionDto.clientId, status: 'active' }
        });
        if (activeSubscription) {
        throw new ConflictException('This client already has an active subscription');
        }
        const startDate = createSubscriptionDto.startDate ? new Date(createSubscriptionDto.startDate) : new Date()

        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + existingPackage.durationDays)

        const packagePrice = Number(existingPackage.price)
        const discount = createSubscriptionDto.discountPercent ?? 0
        const finalPrice = packagePrice * (1-discount/100)

        return await this.prismaService.subscription.create({
            data: {
                clientId: createSubscriptionDto.clientId,
                packageId: createSubscriptionDto.packageId,
                discountPercent: discount,
                endDate: endDate,
                priceAtPurchase: finalPrice,
                startDate: startDate

            }
        })

    }
}
