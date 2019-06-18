import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import * as jwt from 'jsonwebtoken';
import { SECRET, wx } from '../config';
import { UserRO } from './user.interface';
import { validate } from 'class-validator';
import * as crypto from 'crypto';
import * as util from 'util';
import axios from 'axios';
import { NotUniqueException, WechatException } from './user.exception';
import { ParameterException } from '../core/exception/common.exception';
import { LoggerService } from '../core/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    private loggerService: LoggerService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(loginUserDto: LoginUserDto): Promise<UserEntity> {
    this.loggerService.debug('find one ' + loginUserDto.email);
    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto.createHmac('sha256', loginUserDto.password).digest('hex'),
    };

    return await this.userRepository.findOne(findOneOptions);
  }

  async create(dto: CreateUserDto): Promise<UserRO> {
    // check uniqueness of username/email
    const { username, email, password } = dto;
    const qb = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();

    if (user) {
      throw new NotUniqueException();
    }

    // create new user
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;

    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw new ParameterException();
    } else {
      const savedUser = await this.userRepository.save(newUser);
      return this.buildUserRO(savedUser);
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    const toUpdate = await this.userRepository.findOne(id);
    delete toUpdate.password;

    const updated = Object.assign(toUpdate, dto);
    return await this.userRepository.save(updated);
  }

  async delete(email: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ email });
  }

  async findById(id: number): Promise<UserRO> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({ email });
    return this.buildUserRO(user);
  }

  // wx
  async findByCode(code: string): Promise<UserRO> {
    const url = util.format(wx.loginUrl, wx.appId, wx.appSecret, code);

    const result = await axios.get(url);
    if (result.status !== 200) {
      throw new WechatException();
    }
    const errcode = result.data.errcode;
    const errmsg = result.data.errmsg;
    if (errcode) {
      throw new WechatException({
        message: errmsg
      });
    }

    let user = await this.userRepository.findOne({ openid: result.data.openid });
    if (!user) {
      const userEntity = new UserEntity();
      userEntity.openid = result.data.openid;
      user = await this.userRepository.save(userEntity);
    }
    return this.buildUserRO(user);
  }

  public generateJWT(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      exp: exp.getTime() / 1000
    }, SECRET);
  }

  public buildUserRO(user: UserEntity) {
    const userRO = {
      username: user.username,
      email: user.email,
      token: this.generateJWT(user)
    };

    return { user: userRO };
  }
}
