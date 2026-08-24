import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTestRecordDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a valid string' })
  @MinLength(2, { message: 'Name must have at least 2 characters' })
  name: string;
}
