import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { DataSource, Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly dataSource: DataSource,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findById(createOfferDto.itemId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (wish.owner.id === user.id) {
      throw new ForbiddenException(
        'Вы нем можете скидываться на собственный подарок',
      );
    }

    if (wish.price < wish.raised + createOfferDto.amount) {
      throw new BadRequestException('Итоговая сумма выше стоимости подарка');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const offer = await this.offerRepository.save({
        item: wish,
        amount: createOfferDto.amount,
        hidden: createOfferDto.hidden,
        user,
      });

      await this.wishesService.update(
        createOfferDto.itemId,
        {
          raised: wish.raised + createOfferDto.amount,
          offers: [...wish.offers, offer],
        },
        user.id,
      );

      return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.offerRepository.find({ relations: ['user', 'item'] });
  }

  findById(id: number) {
    const offer = this.offerRepository.findOne({
      where: { id },
      relations: ['user', 'item'],
    });

    if (!offer) {
      throw new NotFoundException('Предложение не найдено');
    }

    return offer;
  }
}
