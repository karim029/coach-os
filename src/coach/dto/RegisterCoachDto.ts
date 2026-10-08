import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator"


export class RegisterCoachDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsPhoneNumber("EG")
    phone: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string
}