import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from './../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { AuthStatusDto } from './dto/auth-status.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(DTO: LoginDto): Promise<AuthDto> {
    try {
      const { email, password } = DTO;

      const user = await this.prisma.user.findUnique({
        where: { email: email },
        select: { password: true, id: true },
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

  async register(DTO: RegisterDto): Promise<AuthDto> {
    try {
      const { email, password } = DTO;
      const existingUser = await this.prisma.user.findUnique({
        where: { email: email },
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

  async checkAuth(DTO: AuthDto): Promise<AuthStatusDto> {
    try {
      const { accessToken } = DTO;

      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: { isProfileCompleted: true },
      });

      if (!user) {
        return { isAuthorized: false, isProfileCompleted: false };
      }
      return {
        isAuthorized: true,
        isProfileCompleted: user.isProfileCompleted,
      };
    } catch (error) {
      return { isAuthorized: false, isProfileCompleted: false };
    }
  }
}
