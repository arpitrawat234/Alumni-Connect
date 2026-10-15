import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDocument } from '../users/user.schema';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  findAll(
    @Query('tag') tag?: string,
    @Query('unanswered') unanswered?: string,
  ) {
    return this.questionsService.findAll(tag, unanswered === 'true');
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@GetUser() user: UserDocument, @Body() dto: CreateQuestionDto) {
    return this.questionsService.create(user.id || user._id || '', dto);
  }

  @Post(':id/answers')
  @UseGuards(JwtAuthGuard)
  addAnswer(
    @Param('id') questionId: string,
    @GetUser() user: UserDocument,
    @Body() dto: CreateAnswerDto,
  ) {
    return this.questionsService.addAnswer(questionId, user.id || user._id || '', dto);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  addComment(
    @Param('id') questionId: string,
    @GetUser() user: UserDocument,
    @Body() dto: CreateCommentDto,
  ) {
    return this.questionsService.addComment(questionId, user.id || user._id || '', dto.body);
  }
}
