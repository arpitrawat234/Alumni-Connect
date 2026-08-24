import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { TestRecord, TestRecordDocument } from './test-record.schema';
import { CreateTestRecordDto } from './dto/create-test-record.dto';

@Injectable()
export class TestRecordsService {
  constructor(
    @InjectModel(TestRecord.name)
    private readonly testRecordModel: Model<TestRecordDocument>,
  ) {}

  async create(createDto: CreateTestRecordDto): Promise<TestRecord> {
    const createdRecord = new this.testRecordModel(createDto);
    return createdRecord.save();
  }

  async findAll(): Promise<TestRecord[]> {
    return this.testRecordModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<TestRecord> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }

    const record = await this.testRecordModel.findById(id).exec();
    if (!record) {
      throw new NotFoundException(`Test record with ID ${id} not found`);
    }

    return record;
  }
}
