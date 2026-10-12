import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/decorators/current-user.decorator.js';
import { CreateSubscriptionDto } from './dto/create-subscription.dto.js';
@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subcriptionService: SubscriptionService){}


    @Post()
    @UseGuards(JwtAuthGuard)
    async createNewSubscription(@CurrentUser() user: AuthUser, @Body() dto: CreateSubscriptionDto){
        return await this.subcriptionService.createSubscription(user.id, dto)
    }
}
