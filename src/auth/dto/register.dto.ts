import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";
 
export class RegisterDto { 
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

    @ApiProperty({
        example: "sasha",
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(16)
    first_name: string;

    @ApiProperty({
        example: "ariapor",
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(16)
    last_name: string;
}