import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { SubmitPollResponseRequest, SubmitPollAnswerRequest } from '@simpleblog/shared';

export class SubmitPollAnswerDto implements SubmitPollAnswerRequest {
  @ApiProperty({ description: 'Question ID' })
  @IsNumber()
  questionId: number;

  @ApiPropertyOptional({ description: 'Selected option ID for single/multiple choice' })
  @IsOptional()
  @IsNumber()
  optionId?: number;

  @ApiPropertyOptional({ description: 'Text answer for text questions' })
  @IsOptional()
  @IsString()
  textAnswer?: string;
}

export class SubmitPollResponseDto implements SubmitPollResponseRequest {
  @ApiProperty({ description: 'Poll ID' })
  @IsNumber()
  pollId: number;

  @ApiProperty({ description: 'Poll answers', type: [SubmitPollAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitPollAnswerDto)
  answers: SubmitPollAnswerDto[];
}