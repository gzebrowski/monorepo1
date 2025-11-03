import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
            publishedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async findOneWithPassword(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }



  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateData = { ...updateUserDto };
    
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...result } = user;
    return result;
  }

  async remove(id: number) {
    await this.prisma.user.delete({
      where: { id },
    });
    
    return { message: 'User deleted successfully' };
  }

  async updateTokenHash(id: number, tokenHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { tokenHash },
    });
  }

  async findByTokenHash(tokenHash: string) {
    return this.prisma.user.findFirst({
      where: { tokenHash },
    });
  }

  async clearTokenHash(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: { tokenHash: null },
    });
  }
}