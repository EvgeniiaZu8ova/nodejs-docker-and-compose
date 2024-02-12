import {
  IsDefined,
  IsEmail,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @Length(1, 64)
  username: string;

  @IsDefined()
  @IsString()
  @MinLength(2)
  password: string;

  @IsString()
  @Length(0, 200)
  about: string = 'Пока ничего не рассказал о себе';

  @IsUrl()
  avatar: string;

  @IsDefined()
  @IsEmail()
  email: string;
}
