import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreatePackageDto{

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNumber()
    @IsNotEmpty()
    durationDays: number

    @IsNotEmpty()
    @IsNumber()
    price: number

    @IsString()
    @IsNotEmpty()
    description: string

}