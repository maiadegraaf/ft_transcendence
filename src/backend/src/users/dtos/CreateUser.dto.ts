import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  // @IsNotEmpty()
  // id: number;

  @IsNotEmpty()
  login: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
