import { IsString, IsOptional, IsBoolean, IsDateString, IsArray, ValidateNested, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreatePollRequest, CreatePollQuestionRequest, CreatePollOptionRequest } from '@simpleblog/shared';

export class CreatePollOptionDto implements CreatePollOptionRequest {
  @ApiProperty({ description: 'Option text' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Display order' })
  @IsNumber()
  @Min(0)
  order: number;
}

export class CreatePollQuestionDto implements CreatePollQuestionRequest {
  @ApiProperty({ description: 'Question text' })
  @IsString()
  question: string;

  @ApiProperty({ description: 'Question type', enum: ['single', 'multiple', 'text'] })
  @IsEnum(['single', 'multiple', 'text'])
  questionType: 'single' | 'multiple' | 'text';

  @ApiProperty({ description: 'Is this question required?' })
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({ description: 'Display order' })
  @IsNumber()
  @Min(0)
  order: number;

  @ApiPropertyOptional({ description: 'Answer options for single/multiple choice', type: [CreatePollOptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePollOptionDto)
  options?: CreatePollOptionDto[];
}

export class CreatePollDto implements CreatePollRequest {
  @ApiProperty({ description: 'Poll title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Poll description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Is poll active?', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Poll start date' })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Poll end date' })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ description: 'Poll questions', type: [CreatePollQuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePollQuestionDto)
  questions: CreatePollQuestionDto[];
}