import {
  IsDateString,
  IsDefined,
  IsInt,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class UserPublicProfileResponseDto {
  @IsDefined()
  @IsInt()
  id: number;

  @IsDefined()
  @IsString()
  @Length(1, 64)
  username: string;

  @IsDefined()
  @IsString()
  @Length(2, 200)
  about: string = 'Пока ничего не рассказал о себе';

  @IsDefined()
  @IsUrl()
  avatar: string;

  @IsDefined()
  @IsDateString()
  createdAt: Date;

  @IsDefined()
  @IsDateString()
  updatedAt: Date;
}
