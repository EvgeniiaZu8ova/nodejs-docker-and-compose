import {
  IsString,
  Length,
  IsUrl,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 64)
  username: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @IsEmail()
  email;

  @IsOptional()
  @IsString()
  @MinLength(2)
  password;
}
