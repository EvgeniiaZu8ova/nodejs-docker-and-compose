import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { BadRequestExceptionFilter } from 'src/common/filters/bad-request-exception.filter';
import { EntityNotFoundFilter } from 'src/common/filters/entity-not-found-exception.filter';

@Controller('offers')
@UseGuards(JwtAuthGuard)
@UseFilters(BadRequestExceptionFilter)
@UseFilters(EntityNotFoundFilter)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@AuthUser() user: User, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.create(user, createOfferDto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findById(+id);
  }
}
