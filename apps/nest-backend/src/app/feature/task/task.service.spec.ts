import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { describe, expect, it, vi } from 'vitest';

describe('TaskService', () => {
  let service: TaskService;
  let mockTaskRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    })
      .useMocker((token) => {
        if (token === getRepositoryToken(Task)) {
          return {
            create: vi.fn(),
            save: vi.fn(),
            find: vi.fn(),
            findAndCount: vi.fn(),
            findOne: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
          };
        }

        if (typeof token === 'function') {
          return vi.fn();
        }
      })
      .compile();
    service = module.get<TaskService>(TaskService);
    mockTaskRepository = module.get(getRepositoryToken(Task));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a task', async () => {
    const createTaskDto: CreateTaskDto = {
      id: '1',
      text: 'Test task',
      day: '2023-07-31',
      reminder: true,
    };
    const expectedResult = { id: '1', ...createTaskDto };
    mockTaskRepository.create.mockReturnValue(createTaskDto);
    mockTaskRepository.save.mockResolvedValue(expectedResult);
    const result = await service.create(createTaskDto);
    expect(mockTaskRepository.create).toHaveBeenCalledWith(createTaskDto);
    expect(mockTaskRepository.save).toHaveBeenCalledWith(createTaskDto);
    expect(result).toEqual(expectedResult);
  });
  it('should return a paginated result of tasks', async () => {
    const expectedTasks = [
      { id: '1', text: 'Task 1', day: '2023-07-31', reminder: true },
      { id: '2', text: 'Task 2', day: '2023-08-01', reminder: false },
    ];
    mockTaskRepository.findAndCount.mockResolvedValue([expectedTasks, 2]);
    const result = await service.findAll();
    expect(mockTaskRepository.findAndCount).toHaveBeenCalled();
    expect(result.data).toEqual(expectedTasks);
    expect(result.total).toBe(2);
  });
  it('should return a task by id', async () => {
    const id = '1';
    const expectedResult = {
      id,
      text: 'Task 1',
      day: '2023-07-31',
      reminder: true,
    };
    mockTaskRepository.findOne.mockResolvedValue(expectedResult);
    const result = await service.findOne(id);
    expect(mockTaskRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(expectedResult);
  });
  it('should update a task', async () => {
    const id = '1';
    const updateTaskDto: UpdateTaskDto = {
      text: 'Updated task',
      day: '2023-08-01',
      reminder: false,
    };
    const updatedTask = { id, ...updateTaskDto };
    mockTaskRepository.update.mockResolvedValue({ affected: 1 });
    mockTaskRepository.findOne.mockResolvedValue(updatedTask);
    const result = await service.update(id, updateTaskDto);
    expect(mockTaskRepository.update).toHaveBeenCalledWith(id, {
      text: updateTaskDto.text,
      day: updateTaskDto.day,
      reminder: updateTaskDto.reminder,
    });
    expect(result).toEqual(updatedTask);
  });
  it('should remove a task by id', async () => {
    const id = '1';
    const expectedResult = { affected: 1 };
    mockTaskRepository.delete.mockResolvedValue(expectedResult);
    const result = await service.remove(id);
    expect(mockTaskRepository.delete).toHaveBeenCalledWith(id);
    expect(result).toEqual(1);
  });
  it('should remove a task by name', async () => {
    const name = 'Test task';
    const expectedResult = { affected: 1 };
    mockTaskRepository.delete.mockResolvedValue(expectedResult);
    const result = await service.removeByName(name);
    expect(mockTaskRepository.delete).toHaveBeenCalledWith({ text: name });
    expect(result).toEqual(1);
  });
});
