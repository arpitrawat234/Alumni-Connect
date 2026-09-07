import { IsNotEmpty, IsEmail, IsString, MinLength, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { UserRole } from '../../users/user.schema';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  password: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Role must be either STUDENT or ALUMNI' })
  role: UserRole;

  @IsOptional()
  @IsString()
  college?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsNumber()
  graduationYear?: number;
}
