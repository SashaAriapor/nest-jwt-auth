import { IsEmail, IsString, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
    @ApiProperty({
        example: "test@gmail.com",
        required: true
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: "password",
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;
}