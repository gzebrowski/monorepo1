import { IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { PollFilters } from '@simpleblog/shared';

export class PollFiltersDto implements PollFilters {
  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by author ID' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  authorId?: number;
}