import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDocument, UserRole, VerificationStatus } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('A user with this email address already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    const user = await this.usersService.create({
      name: registerDto.name.trim(),
      email: registerDto.email.toLowerCase().trim(),
      passwordHash,
      role: registerDto.role,
      verificationStatus:
        registerDto.role === UserRole.ALUMNI
          ? VerificationStatus.PENDING
          : VerificationStatus.VERIFIED,
    });

    // Create initial profile shell
    const initialProfileData: any = {
      college: registerDto.college || '',
      graduationYear: registerDto.graduationYear || null,
    };
    if (registerDto.role === UserRole.STUDENT && registerDto.branch) {
      initialProfileData.branch = registerDto.branch;
    }

    const { profile, completionPercentage } = await this.profilesService.updateProfile(
      user._id.toString(),
      user.role,
      initialProfileData,
    );

    const token = this.generateToken(user);

    return {
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
      profile,
      completionPercentage,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { profile, completionPercentage } = await this.profilesService.getProfileByUserId(
      user._id.toString(),
      user.role,
    );

    const token = this.generateToken(user);

    return {
      accessToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
      profile,
      completionPercentage,
    };
  }

  async getMe(user: UserDocument) {
    const { profile, completionPercentage } = await this.profilesService.getProfileByUserId(
      user._id.toString(),
      user.role,
    );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
      },
      profile,
      completionPercentage,
    };
  }

  private generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
