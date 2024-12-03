import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(DTO: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(DTO.password, roundsOfHashing);

    DTO.password = hashedPassword;

    return this.prisma.user.create({
      data: DTO,
    });
  }
}
