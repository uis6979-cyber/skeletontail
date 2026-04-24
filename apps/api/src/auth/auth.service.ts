import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

import * as bcrypt from 'bcryptjs';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  // 🔐 LOGIN
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      id: user.id,
      email: user.email,
    };
  }

  // 🧾 REGISTER
  async register(dto: RegisterDto) {
    try {
      console.log("🔥 REGISTER DTO:", dto);
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashed = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashed,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      return {
        id: user.id,
        email: user.email,
      };
    } catch (error) {
      console.log('🔥 REGISTER ERROR FULL:', error);
      throw error;
    }
  }
}