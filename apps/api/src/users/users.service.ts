import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        isActive: true,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("common.messages.userNotFound");
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    birthDate?: Date;
    gender?: string;
    language?: string;
    avatarUrl?: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException("signup.messages.errors.emailAlreadyExists");
    }

    const hashed = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        birthDate: data.birthDate,
        gender: data.gender,
        language: data.language || "es",
        avatarUrl: data.avatarUrl,
      },
    });
  }

  async update(
    id: string,
    data: {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      birthDate?: Date;
      gender?: string;
      language?: string;
      avatarUrl?: string;
      isActive?: boolean;
    },
  ) {
    const user = await this.findOne(id);

    let hashedPassword = user.password;

    // Re-hash password only if it is explicitly provided in the update payload
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        birthDate: data.birthDate,
        gender: data.gender,
        language: data.language,
        avatarUrl: data.avatarUrl,
        isActive: data.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Implement soft delete by toggling the isActive flag
    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}
