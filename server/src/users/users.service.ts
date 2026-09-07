import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, VerificationStatus } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    verificationStatus?: VerificationStatus;
  }): Promise<UserDocument> {
    const user = new this.userModel({
      ...data,
      verificationStatus:
        data.verificationStatus ||
        (data.role === UserRole.ALUMNI
          ? VerificationStatus.PENDING
          : VerificationStatus.VERIFIED),
    });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}
