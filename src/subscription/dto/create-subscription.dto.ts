import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"



export class CreateSubscriptionDto {

    @IsString()
    @IsNotEmpty()
    clientId: string
    @IsNotEmpty()
    @IsString()
    packageId: string

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    discountPercent?: number

    @IsOptional()
    @IsDateString()
    startDate?: string

}