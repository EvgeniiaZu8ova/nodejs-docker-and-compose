import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DataSource, In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}

  create(createWishDto: CreateWishDto, user: User) {
    return this.wishRepository.save({ ...createWishDto, owner: user });
  }

  findLast() {
    return this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers'],
    });
  }

  findTop() {
    return this.wishRepository.find({
      order: { copied: 'ASC' },
      take: 20,
      relations: ['owner', 'offers'],
    });
  }

  findById(id: number) {
    return this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });
  }

  findMany(ids: number[]) {
    return (
      this.wishRepository.find({
        where: { id: In(ids) },
      }) || []
    );
  }

  async update(
    id: number,
    updateWishDto: Partial<UpdateWishDto>,
    userId: number,
  ) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете редактировать чужие подарки');
    }

    if (wish.offers.length > 0) {
      throw new BadRequestException(
        'Нельзя редактировать подарки, у которых уже есть желающие скинуться',
      );
    }

    return this.wishRepository.update(id, updateWishDto);
  }

  async remove(id: number, userId: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Вы не можете удалять чужие подарки');
    }

    return this.wishRepository.delete(id);
  }

  async copy(id: number, user: User) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.create(wish, user);
      await this.wishRepository.update(id, { copied: ++wish.copied });
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
