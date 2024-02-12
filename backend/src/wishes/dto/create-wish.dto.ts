import {
  IsDefined,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsDefined()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsDefined()
  @IsUrl()
  link: string;

  @IsDefined()
  @IsUrl()
  image: string;

  @IsDefined()
  @IsNumber()
  @Min(1)
  price: number;

  @IsDefined()
  @IsString()
  description: string;
}
