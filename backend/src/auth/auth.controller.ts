import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserAlreadyExistsException } from 'src/common/exceptions/user-already-exists.exception';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { BadRequestExceptionFilter } from 'src/common/filters/bad-request-exception.filter';
import { EntityNotFoundFilter } from 'src/common/filters/entity-not-found-exception.filter';

@Controller()
@UseFilters(BadRequestExceptionFilter)
@UseFilters(EntityNotFoundFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@AuthUser() user: User): Promise<any> {
    return this.authService.login(user.id);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    if (
      await this.usersService.findOne({
        where: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      })
    ) {
      throw new UserAlreadyExistsException();
    }

    const user = await this.usersService.signup(createUserDto);
    return user;
  }
}
