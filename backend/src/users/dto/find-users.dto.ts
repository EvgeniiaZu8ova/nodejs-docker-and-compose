import { IsDefined, IsString } from 'class-validator';

export class FindUsersDto {
  @IsDefined()
  @IsString()
  query: string;
}
