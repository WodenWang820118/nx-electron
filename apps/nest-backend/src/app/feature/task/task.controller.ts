import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Log } from '../../core/logging-interceptor/logging-interceptor.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Log('Find All Tasks')
  async getTasks(@Query() query: PaginationQueryDto) {
    return await this.taskService.findAll(query);
  }

  @Get(':id')
  async getTask(id: string) {
    return await this.taskService.findOne(id);
  }

  @Post('/create')
  async createTask(@Body() task: CreateTaskDto) {
    return await this.taskService.create(task);
  }

  @Put(':id')
  async updateTask(@Body() task: CreateTaskDto) {
    return await this.taskService.update(task.id, task);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return await this.taskService.remove(id);
  }
}
