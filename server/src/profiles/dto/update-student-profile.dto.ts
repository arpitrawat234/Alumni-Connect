import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateStudentProfileDto {
  @IsOptional()
  @IsString()
  college?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsNumber()
  graduationYear?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  careerInterests?: string[];

  @IsOptional()
  @IsString()
  bio?: string;
}
