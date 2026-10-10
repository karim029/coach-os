import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MinLength } from "class-validator"


export class ActivateClientDto{
    
    @IsEmail()
    @IsOptional()
    email: string

    @IsStrongPassword()
    @MinLength(8)
    @IsString()
    @IsNotEmpty()
    password: string
}