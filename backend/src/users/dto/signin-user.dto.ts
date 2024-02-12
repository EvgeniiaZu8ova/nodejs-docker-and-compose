import { IsDefined, IsString, Length, MinLength } from 'class-validator';

export class SignInUserDto {
  @IsDefined()
  @IsString()
  @Length(1, 64)
  username: string;

  @IsDefined()
  @IsString()
  @MinLength(2)
  password: string;
}
