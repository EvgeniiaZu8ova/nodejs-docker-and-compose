import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserPublicProfileResponseDto } from './dto/userPublicProfileResponseDto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/userProfileResponseDto copy';
import { FindUsersDto } from './dto/find-users.dto';
import { UserWishesDto } from './dto/user-wishes.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { EntityNotFoundFilter } from 'src/common/filters/entity-not-found-exception.filter';
import { UserAlreadyExistsExceptionFilter } from 'src/common/filters/user-already-exists.filter';
import { BadRequestExceptionFilter } from 'src/common/filters/bad-request-exception.filter';

@Controller('users')
@UseFilters(UserAlreadyExistsExceptionFilter)
@UseFilters(BadRequestExceptionFilter)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() user: User) {
    return this.usersService.create(user);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Delete(':id')
  remove(@AuthUser() user: User, @Param('id') id: string) {
    return this.usersService.removeOne(+id, user);
  }

  @Get('me')
  async findMe(@AuthUser() user: User): Promise<UserProfileResponseDto> {
    return this.usersService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Patch('me')
  @UseFilters(EntityNotFoundFilter)
  async update(
    @AuthUser() user: User,
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = await this.usersService.update(
      req.user.userId,
      updateUserDto,
      user,
    );

    return userData;
  }

  @Get('me/wishes')
  async getMyWishes(@AuthUser() user: User): Promise<Wish[]> {
    const me = await this.usersService.findOne({
      where: { id: user.id },
      relations: ['wishes'],
    });

    return me?.wishes || [];
  }

  @Get(':username')
  findOne(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.findOne({
      where: { username },
    });
  }

  @Get(':username/wishes')
  @UseFilters(EntityNotFoundFilter)
  async getWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    const user = await this.usersService.findOne({
      where: { username },
      relations: ['wishes'],
    });

    return user.wishes;
  }

  @Post('find')
  @HttpCode(200)
  findMany(
    @Body() findUsersDto: FindUsersDto,
  ): Promise<UserProfileResponseDto[]> {
    return this.usersService.findMany(findUsersDto.query);
  }
}
