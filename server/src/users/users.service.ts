import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDocument, UserRole, VerificationStatus } from './user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    verificationStatus?: VerificationStatus;
  }): Promise<UserDocument> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        email: data.email.toLowerCase().trim(),
        verificationStatus:
          data.verificationStatus ||
          (data.role === UserRole.ALUMNI
            ? VerificationStatus.PENDING
            : VerificationStatus.VERIFIED),
      },
    });

    return {
      ...user,
      role: user.role as UserRole,
      verificationStatus: (user.verificationStatus as VerificationStatus) || VerificationStatus.VERIFIED,
      _id: user.id,
    } as UserDocument;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      role: user.role as UserRole,
      verificationStatus: user.verificationStatus as VerificationStatus,
      _id: user.id,
    } as UserDocument;
  }

  async findById(id: string): Promise<UserDocument | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return null;
    }

    return {
      ...user,
      role: user.role as UserRole,
      verificationStatus: user.verificationStatus as VerificationStatus,
      _id: user.id,
    } as UserDocument;
  }
}
