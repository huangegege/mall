import { UserNotFoundException } from './user.exception';
import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UserRO } from './user.interface';
import { CreateUserDto, UpdateUserDto, LoginUserDto, MpLoginUserDto } from './dto';
import { User } from './user.decorator';
import { ValidationPipe } from '../core/validation/validation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  async findMe(@User() user: UserEntity): Promise<UserRO> {
    return await this.userService.buildUserRO(user);
  }

  @Put('user')
  async update(@User('id') userId: number, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(userId, userData);
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete('users/:slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }

  @UsePipes(new ValidationPipe())
  @Post('users/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserRO> {
    const userData = await this.userService.findOne(loginUserDto);

    if (!userData) {
      throw new UserNotFoundException();
    }

    const token = await this.userService.generateJWT(userData);
    const { email, username } = userData;
    return { email, token, username };
  }

  @UsePipes(new ValidationPipe())
  @Post('users/mp/login')
  async mpLogin(@Body() mpLoginUserDto: MpLoginUserDto): Promise<UserRO> {
    return await this.userService.findByCode(mpLoginUserDto.code);
  }
}
