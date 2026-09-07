import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateAlumniProfileDto {
  @IsOptional()
  @IsString()
  college?: string;

  @IsOptional()
  @IsNumber()
  graduationYear?: number;

  @IsOptional()
  @IsString()
  currentCompany?: string;

  @IsOptional()
  @IsString()
  currentRole?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  helpTopics?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  servicesOffered?: string[];
}
