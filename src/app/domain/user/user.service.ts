import {ConflictException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ConfigService} from '../../../config/config.service';
import {Like, Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';

import {FindUserDto, UserSignupDto} from './dto/user-request.dto';
import {UserEntity} from './entity/user.entity';
import {Logger} from '../../../logger/logger';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async getAllUsers() {
    return this.userRepo.find({});
  }

  async findUserByProperty(data: FindUserDto) {
    const {email, first_name, last_name, name} = data;
    const users = await this.userRepo.find({
      where: [
        // OR query
        {name: Like(`%${name}`)},
        {email: Like(`%${email}`)},
        {first_name: Like(`%${first_name}`)},
        {last_name: Like(`%${last_name}`)},
      ],
    });
    return users;
  }

  async create(userInput: UserSignupDto): Promise<UserEntity> {
    const userEntity = this.userRepo.create();
    const {email} = userInput;
    const existingUser = await this.findOneByEmail(email.toLowerCase());
    if (existingUser) {
      throw new ConflictException('user with email already exists');
    }
    const pass = await this.hashPassword(userInput.password);

    const saveEntity = {
      ...userEntity,
      ...userInput,
      password: pass,
      first_name: userInput?.first_name.toLowerCase(),
      last_name: userInput?.last_name.toLowerCase(),
      email: userInput?.email.toLowerCase(),
    };

    let user: UserEntity | null;
    try {
      user = await this.userRepo.save(saveEntity);
      this.logger.log(`user created successfully ${JSON.stringify(user)}`);
      return user;
    } catch (err) {
      this.logger.error(err);
      throw new ConflictException(`user already exist with same email`);
    }
  }
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  hashData(token: string) {
    return bcrypt.hash(token, 10);
  }

  async updateRefreshTokenByEmail(email: string, refToken: string) {
    if (!refToken) {
      const user = await this.findOneByEmail(email.toLowerCase());
      const saveEntity = {...user, refresh_token: null};
      return await this.userRepo.save(saveEntity);
    }
    const hashedToken = await this.hashData(refToken);
    const user = await this.findOneByEmail(email.toLowerCase());
    const saveEntity = {...user, refresh_token: hashedToken};
    return await this.userRepo.save(saveEntity);
  }
}
