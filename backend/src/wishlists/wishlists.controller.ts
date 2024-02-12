import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { BadRequestExceptionFilter } from 'src/common/filters/bad-request-exception.filter';
import { EntityNotFoundFilter } from 'src/common/filters/entity-not-found-exception.filter';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
@UseFilters(BadRequestExceptionFilter)
@UseFilters(EntityNotFoundFilter)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  create(@AuthUser() user: User, @Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistsService.create(createWishlistDto, user);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(+id, updateWishlistDto, user);
  }

  @Delete(':id')
  remove(@AuthUser() user: User, @Param('id') id: string) {
    return this.wishlistsService.remove(+id, user);
  }
}
