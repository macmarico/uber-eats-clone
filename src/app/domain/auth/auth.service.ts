import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {ConfigService} from 'src/config/config.service';
import {UserService} from '../user/user.service';
import {UserSigInDto} from './dto/auth-request.dto';
import * as bcrypt from 'bcrypt';
import {JwtPayload} from 'jsonwebtoken';
import {JwtService} from '@nestjs/jwt';
import {UserEntity} from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateJwtPayload(payload: JwtPayload) {
    return await this.usersService.findOneByEmail(payload.email);
  }

  async validateUserByPassword(payload: UserSigInDto) {
    const {email, password} = payload;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      // we will throw some custom exception later
      throw new NotFoundException();
    }
    let isMatch = false;

    isMatch = await this.comparePassword(password, user.password);

    if (isMatch) {
      const data = await this.createToken(user);
      // await this.updateRefreshToken(user.email, data.refresh_token);
      return data;
    } else {
      throw new NotFoundException(`user with email password not found`);
    }
  }

  public async createToken(user: UserEntity) {
    const data: JwtPayload = {
      userId: user.id,
      email: user.email,
      permissions: user.permissions,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(data, {
        secret: this.configService.get().auth.access_token_secret,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(data, {
        secret: this.configService.get().auth.refresh_token_secret,
        expiresIn: '7d',
      }),
    ]);
    return {
      ...data,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  private async comparePassword(enteredPassword, dbPassword) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  private async updateRefreshToken(email: string, refToken: string) {
    await this.usersService.updateRefreshTokenByEmail(email, refToken);
  }

  public async refreshToken(user: UserEntity) {
    const {id, refresh_token, email} = user;
    const userData = await this.usersService.findOneByEmail(email);
    if (!userData) {
      throw new ForbiddenException();
    }
    const isMatchFound = await bcrypt.compare(
      refresh_token,
      userData.refresh_token,
    );
    if (!isMatchFound) {
      throw new ForbiddenException();
    }
    const tokens = await this.createToken(user);
    await this.updateRefreshToken(user.email, tokens.refresh_token);
    return tokens;
  }

  public async logout(user: UserEntity) {
    const {id, refresh_token, email} = user;
    await this.usersService.updateRefreshTokenByEmail(user.email, null);
  }
}
