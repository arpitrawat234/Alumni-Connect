import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { TestRecordsService } from './test-records.service';
import { CreateTestRecordDto } from './dto/create-test-record.dto';

@Controller('test-records')
export class TestRecordsController {
  constructor(private readonly testRecordsService: TestRecordsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTestRecordDto: CreateTestRecordDto) {
    return this.testRecordsService.create(createTestRecordDto);
  }

  @Get()
  findAll() {
    return this.testRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testRecordsService.findOne(id);
  }
}
