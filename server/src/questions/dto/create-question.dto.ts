import { ArrayMaxSize, IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @MinLength(5)
  @MaxLength(180)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10000)
  body: string;

  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  mentionedUserIds?: string[];

  @IsOptional()
  @IsString()
  targetAlumniId?: string;
}
