import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator"


export class CreateClientDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber("EG")
    phone: string

    @IsOptional()
    @IsEmail()
    email?: string
}