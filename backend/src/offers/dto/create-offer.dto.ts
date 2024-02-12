import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateOfferDto {
  @IsDefined()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  @IsDefined()
  @IsNumber()
  itemId: number;
}
