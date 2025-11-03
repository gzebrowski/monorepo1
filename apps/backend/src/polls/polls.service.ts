import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { 
  CreatePollRequest, 
  UpdatePollRequest, 
  SubmitPollResponseRequest,
  PollFilters 
} from '@simpleblog/shared';

@Injectable()
export class PollsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: PollFilters) {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.authorId) {
      where.authorId = filters.authorId;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.poll.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        questions: {
          include: {
            options: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const poll = await this.prisma.poll.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        questions: {
          include: {
            options: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    if (!poll) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }

    return poll;
  }

  async create(createPollData: CreatePollRequest, authorId: number) {
    const { questions, ...pollData } = createPollData;

    return this.prisma.poll.create({
      data: {
        ...pollData,
        authorId,
        questions: {
          create: questions.map((question) => ({
            question: question.question,
            questionType: question.questionType,
            isRequired: question.isRequired,
            order: question.order,
            options: {
              create: question.options?.map((option) => ({
                text: option.text,
                order: option.order,
              })) || [],
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async update(id: number, updatePollData: UpdatePollRequest, userId: number) {
    // Check if poll exists and user is author
    const poll = await this.prisma.poll.findUnique({
      where: { id },
    });

    if (!poll) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }

    if (poll.authorId !== userId) {
      throw new ForbiddenException('You can only update your own polls');
    }

    return this.prisma.poll.update({
      where: { id },
      data: updatePollData,
    });
  }

  async remove(id: number, userId: number) {
    // Check if poll exists and user is author
    const poll = await this.prisma.poll.findUnique({
      where: { id },
    });

    if (!poll) {
      throw new NotFoundException(`Poll with ID ${id} not found`);
    }

    if (poll.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own polls');
    }

    await this.prisma.poll.delete({
      where: { id },
    });

    return { message: 'Poll deleted successfully' };
  }

  async submitResponse(responseData: SubmitPollResponseRequest, userId: number) {
    const { pollId, answers } = responseData;

    // Check if poll exists and is active
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!poll) {
      throw new NotFoundException(`Poll with ID ${pollId} not found`);
    }

    if (!poll.isActive) {
      throw new ForbiddenException('This poll is not active');
    }

    // Check if user already responded
    const existingResponse = await this.prisma.pollResponse.findUnique({
      where: {
        pollId_userId: {
          pollId,
          userId,
        },
      },
    });

    if (existingResponse) {
      throw new ForbiddenException('You have already responded to this poll');
    }

    // Create response with answers
    return this.prisma.pollResponse.create({
      data: {
        pollId,
        userId,
        answers: {
          create: answers.map((answer) => ({
            questionId: answer.questionId,
            optionId: answer.optionId,
            textAnswer: answer.textAnswer,
          })),
        },
      },
      include: {
        answers: {
          include: {
            question: true,
            option: true,
          },
        },
      },
    });
  }

  async getResponses(pollId: number, userId: number) {
    // Check if poll exists and user is author
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
    });

    if (!poll) {
      throw new NotFoundException(`Poll with ID ${pollId} not found`);
    }

    if (poll.authorId !== userId) {
      throw new ForbiddenException('You can only view responses to your own polls');
    }

    return this.prisma.pollResponse.findMany({
      where: { pollId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        answers: {
          include: {
            question: true,
            option: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getResults(pollId: number, userId: number) {
    // Check if poll exists and user is author
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!poll) {
      throw new NotFoundException(`Poll with ID ${pollId} not found`);
    }

    if (poll.authorId !== userId) {
      throw new ForbiddenException('You can only view results of your own polls');
    }

    // Get response statistics
    const totalResponses = await this.prisma.pollResponse.count({
      where: { pollId },
    });

    // Get answer statistics for each question
    const questionStats = await Promise.all(
      poll.questions.map(async (question) => {
        if (question.questionType === 'text') {
          // For text questions, get all text answers
          const textAnswers = await this.prisma.pollAnswer.findMany({
            where: {
              questionId: question.id,
              textAnswer: { not: null },
            },
            select: {
              textAnswer: true,
            },
          });

          return {
            questionId: question.id,
            question: question.question,
            type: question.questionType,
            textAnswers: textAnswers.map(a => a.textAnswer),
          };
        } else {
          // For single/multiple choice, get option counts
          const optionCounts = await Promise.all(
            question.options.map(async (option) => {
              const count = await this.prisma.pollAnswer.count({
                where: {
                  questionId: question.id,
                  optionId: option.id,
                },
              });

              return {
                optionId: option.id,
                text: option.text,
                count,
                percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0,
              };
            })
          );

          return {
            questionId: question.id,
            question: question.question,
            type: question.questionType,
            options: optionCounts,
          };
        }
      })
    );

    return {
      poll: {
        id: poll.id,
        title: poll.title,
        description: poll.description,
      },
      totalResponses,
      questions: questionStats,
    };
  }
}