import { IsArray, IsDefined, IsInt, IsString, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsUrl()
  image: string;

  @IsArray()
  @IsInt({ each: true })
  itemsId: number[];
}
