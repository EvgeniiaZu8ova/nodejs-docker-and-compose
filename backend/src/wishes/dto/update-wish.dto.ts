import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';

export class UpdateWishDto {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  offers: Offer[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  raised: number;
}
