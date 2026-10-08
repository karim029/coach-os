import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"


export class RegisterCoachDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string
}