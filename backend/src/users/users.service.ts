import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { hashValue } from 'src/utils/hash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(query: FindOneOptions<User>) {
    return this.userRepository.findOne(query);
  }

  findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findMany(query: string) {
    return this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto, user: User) {
    const { password } = updateUserDto;
    const userToEdit = await this.findById(id);

    if (!userToEdit) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (userToEdit.id !== user.id) {
      throw new ForbiddenException('Вы не можете редактировать чужой профиль');
    }
    if (password) {
      updateUserDto.password = await hashValue(password);
    }

    return this.userRepository.save({ ...userToEdit, ...updateUserDto });
  }

  async removeOne(id: number, user: User) {
    const userToDelete = await this.findById(id);

    if (!userToDelete) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (userToDelete.id !== user.id) {
      throw new ForbiddenException('Вы не можете удалить чужой профиль');
    }

    return this.userRepository.delete(id);
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;

    const user = await this.userRepository.create({
      ...createUserDto,
      password: await hashValue(password),
    });

    return this.userRepository.save(user);
  }
}
