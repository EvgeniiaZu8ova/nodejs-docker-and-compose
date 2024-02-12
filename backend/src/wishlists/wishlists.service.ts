import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const wishes = await this.wishesService.findMany(createWishlistDto.itemsId);

    return this.wishlistRepository.save({
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      owner: user,
      items: wishes,
    });
  }

  findAll() {
    return this.wishlistRepository.find({ relations: ['owner', 'items'] });
  }

  findById(id: number) {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, user: User) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException('Список не найден');
    }

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете редактировать чужие списки');
    }

    return this.wishlistRepository.update(id, updateWishlistDto);
  }

  async remove(id: number, user: User) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException('Список не найден');
    }

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете удалять чужие списки');
    }

    return this.wishlistRepository.delete(id);
  }
}
