import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UsersService } from './users.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  MockRepository,
  createMockRepository,
} from '../common/mocks/mock-repository';
import { User } from './entities/user.entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let repository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: createMock<UsersService>(),
        },
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    repository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('FindOne', () => {
    describe('When user Id exists', () => {
      it('should return the user object', async () => {
        const userId = '123';
        const expectedUser = {
          id: userId,
        };

        repository.findOneBy.mockReturnValue(expectedUser);
        const user = await controller.findOne(userId);
        // console.log(user);
        expect(user).toEqual(expectedUser);
      });
    });
    describe('Otherwise', () => {
      it('should return error 404', async () => {
        const userId = '123';

        repository.findOneBy.mockReturnValueOnce(undefined);
        try {
          await controller.findOne(userId);
          expect(true).toBe(false);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          console.log(error);
        }
      });
    });
  });
});
