import {
  IsDefined,
  IsInt,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class UserWishesDto {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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
  @IsInt()
  @Min(1)
  price: number;

  @IsDefined()
  @IsInt()
  @Min(1)
  raised: number;

  @IsDefined()
  @IsInt()
  copied: number;

  @IsDefined()
  @IsString()
  @Length(1, 1024)
  description: string;

  @IsDefined()
  offers: Offer[];
}
