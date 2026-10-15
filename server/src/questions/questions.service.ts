import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '../users/user.schema';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tag?: string, unanswered?: boolean) {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      where: unanswered ? { answers: { none: {} } } : undefined,
      include: {
        author: { select: { id: true, name: true, role: true } },
        targetAlumni: { select: { id: true, name: true } },
        mentions: {
          include: { user: { select: { id: true, name: true, role: true } } },
        },
        answers: {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, name: true, role: true } } },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { id: true, name: true, role: true } } },
        },
      },
    });

    if (!tag?.trim()) return questions;
    const normalizedTag = tag.trim().replace(/^#+/, '').toLocaleLowerCase();
    return questions.filter((question) =>
      question.tags.some((questionTag) => questionTag.toLocaleLowerCase() === normalizedTag),
    );
  }

  async create(authorId: string, dto: CreateQuestionDto) {
    const tags = this.normalizeTags(dto.tags);
    if (tags.length === 0) {
      throw new BadRequestException('Add at least one topic tag');
    }
    if (tags.length > 8) {
      throw new BadRequestException('A question can have at most 8 topic tags');
    }

    const title = dto.title.trim();
    const body = dto.body.trim();
    if (!title || !body) {
      throw new BadRequestException('Question title and details are required');
    }

    const mentionedUserIds = [...new Set(dto.mentionedUserIds || [])];
    const targetAlumniId = dto.targetAlumniId || undefined;
    if (targetAlumniId) {
      const target = await this.prisma.user.findUnique({
        where: { id: targetAlumniId },
        select: { role: true },
      });
      if (!target || target.role !== UserRole.ALUMNI) {
        throw new BadRequestException('The selected recipient is not an alumni account');
      }
    }
    if (targetAlumniId && !mentionedUserIds.includes(targetAlumniId)) {
      mentionedUserIds.push(targetAlumniId);
    }
    if (mentionedUserIds.includes(authorId)) {
      throw new BadRequestException('You cannot tag yourself in your question');
    }
    if (mentionedUserIds.length > 10) {
      throw new BadRequestException('A question can mention at most 10 people');
    }

    if (mentionedUserIds.length > 0) {
      const people = await this.prisma.user.findMany({
        where: { id: { in: mentionedUserIds } },
        select: { id: true },
      });
      if (people.length !== mentionedUserIds.length) {
        throw new BadRequestException('One or more tagged people could not be found');
      }
    }

    return this.prisma.question.create({
      data: {
        title,
        body,
        tags,
        authorId,
        targetAlumniId,
        mentions: {
          create: mentionedUserIds.map((userId) => ({
            user: { connect: { id: userId } },
          })),
        },
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
        targetAlumni: { select: { id: true, name: true } },
        mentions: {
          include: { user: { select: { id: true, name: true, role: true } } },
        },
        answers: {
          include: { author: { select: { id: true, name: true, role: true } } },
        },
        comments: {
          include: { author: { select: { id: true, name: true, role: true } } },
        },
      },
    });
  }

  async addAnswer(questionId: string, authorId: string, dto: CreateAnswerDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      select: { id: true },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const body = dto.body.trim();
    if (!body) {
      throw new BadRequestException('Answer cannot be empty');
    }

    return this.prisma.answer.create({
      data: { questionId, authorId, body },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });
  }

  async addComment(questionId: string, authorId: string, body: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      select: { id: true },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const trimmedBody = body.trim();
    if (!trimmedBody) {
      throw new BadRequestException('Comment cannot be empty');
    }

    return this.prisma.questionComment.create({
      data: { questionId, authorId, body: trimmedBody },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });
  }

  private normalizeTags(tags: string[]): string[] {
    const uniqueTags = new Map<string, string>();
    for (const rawTag of tags) {
      const tag = rawTag.trim().replace(/^#+/, '');
      if (tag) {
        const key = tag.toLocaleLowerCase();
        if (!uniqueTags.has(key)) {
          uniqueTags.set(key, tag);
        }
      }
    }
    return [...uniqueTags.values()];
  }
}
