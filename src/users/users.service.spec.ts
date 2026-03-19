import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity/user.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
})

describe('UsersService', () => {
  let service: UsersService;
  let usersRepo: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: createMockRepository<User>()}
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepo = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when user ID exists', () => {
      it('should return the user object', async () => {
        const userId = '123';
        const expectedUser = {
          id: '123',
          username: 'alex',
        };
        usersRepo.findOneBy.mockReturnValue(expectedUser);
        const user = await service.findOne(userId);
        expect(user).toEqual(expectedUser);
      })
    })
    describe('otherwise', () => {
      it('should throw a not found error', async () => {
        const userId = '123';
        usersRepo.findOneBy.mockReturnValueOnce(undefined);

        try {
          await service.findOne(userId);
          expect(true).toEqual(false); // This should never be reached
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`User with id #${userId} not found.`);
        }

      })
    })
  })
});
