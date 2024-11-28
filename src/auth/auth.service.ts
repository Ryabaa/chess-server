import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CheckAuthDto } from './dto/checkAuth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(LoginDto: LoginDto): Promise<AuthEntity> {
    try {
      const { email, password } = LoginDto;
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        throw new NotFoundException(`No user found for email: ${email}`);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      return {
        accessToken: this.jwtService.sign({ userId: user.id }),
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthEntity> {
    try {
      const { email, password } = registerDto;
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException('This email is taken by another user');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      return {
        accessToken: this.jwtService.sign({ userId: user.id }),
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async checkAuth(
    CheckAuthDto: CheckAuthDto,
  ): Promise<{ isAuthorized: boolean }> {
    try {
      const { accessToken } = CheckAuthDto;

      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        return { isAuthorized: false };
      } else {
        return { isAuthorized: true };
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
