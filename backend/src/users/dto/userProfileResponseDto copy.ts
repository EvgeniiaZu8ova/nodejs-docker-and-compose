import { IsDefined, IsEmail } from 'class-validator';
import { UserPublicProfileResponseDto } from './userPublicProfileResponseDto';

export class UserProfileResponseDto extends UserPublicProfileResponseDto {
  @IsDefined()
  @IsEmail()
  email;
}
