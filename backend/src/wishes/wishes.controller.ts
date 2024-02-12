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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { EntityNotFoundFilter } from 'src/common/filters/entity-not-found-exception.filter';
import { BadRequestExceptionFilter } from 'src/common/filters/bad-request-exception.filter';

@Controller('wishes')
@UseFilters(BadRequestExceptionFilter)
@UseFilters(EntityNotFoundFilter)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@AuthUser() user: User, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.update(+id, updateWishDto, user.id);

    return wish;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@AuthUser() user: User, @Param('id') id: string) {
    return this.wishesService.remove(+id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copy(@AuthUser() user: User, @Param('id') id: string) {
    return await this.wishesService.copy(+id, user);
  }
}
