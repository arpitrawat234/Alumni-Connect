import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestRecordsController } from './test-records.controller';
import { TestRecordsService } from './test-records.service';
import { TestRecord, TestRecordSchema } from './test-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TestRecord.name, schema: TestRecordSchema },
    ]),
  ],
  controllers: [TestRecordsController],
  providers: [TestRecordsService],
  exports: [TestRecordsService],
})
export class TestRecordsModule {}
