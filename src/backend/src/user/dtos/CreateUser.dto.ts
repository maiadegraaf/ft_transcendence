import { IsEmail, IsInt, IsNotEmpty } from 'class-validator'

export class CreateUserDto {
    @IsNotEmpty()
    @IsInt()
    id: number

    @IsNotEmpty()
    login: string

    @IsEmail()
    @IsNotEmpty()
    email: string
}
