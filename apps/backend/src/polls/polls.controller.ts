import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PollsService } from './polls.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { SubmitPollResponseDto } from './dto/submit-poll-response.dto';
import { PollFiltersDto } from './dto/poll-filters.dto';

@ApiTags('polls')
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all polls' })
  @ApiResponse({ status: 200, description: 'Returns all polls' })
  async findAll(@Query() filters: PollFiltersDto) {
    return this.pollsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get poll by ID' })
  @ApiResponse({ status: 200, description: 'Returns poll by ID' })
  @ApiResponse({ status: 404, description: 'Poll not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new poll' })
  @ApiResponse({ status: 201, description: 'Poll created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createPollDto: CreatePollDto, @Request() req) {
    return this.pollsService.create(createPollDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update poll' })
  @ApiResponse({ status: 200, description: 'Poll updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not poll author' })
  @ApiResponse({ status: 404, description: 'Poll not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePollDto: UpdatePollDto,
    @Request() req
  ) {
    return this.pollsService.update(id, updatePollDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete poll' })
  @ApiResponse({ status: 200, description: 'Poll deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not poll author' })
  @ApiResponse({ status: 404, description: 'Poll not found' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.pollsService.remove(id, req.user.id);
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit poll response' })
  @ApiResponse({ status: 201, description: 'Response submitted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Already responded or poll inactive' })
  @ApiResponse({ status: 404, description: 'Poll not found' })
  async submitResponse(@Body() submitDto: SubmitPollResponseDto, @Request() req) {
    return this.pollsService.submitResponse(submitDto, req.user.id);
  }

  @Get(':id/responses')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get poll responses (author only)' })
  @ApiResponse({ status: 200, description: 'Returns poll responses' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not poll author' })
  @ApiResponse({ status: 404, description: 'Poll not found' })
  async getResponses(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.pollsService.getResponses(id, req.user.id);
  }

  @Get(':id/results')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get poll results/statistics (author only)' })
  @ApiResponse({ status: 200, description: 'Returns poll results' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not poll author' })
  @ApiResponse({ status: 404, description: 'Poll not found' })
  async getResults(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.pollsService.getResults(id, req.user.id);
  }
}