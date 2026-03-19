import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';
import { UsersModule } from '../users/users.module';
import { createMock } from '@golevelup/ts-jest';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository } from '../common/mocks/mock-repository';
import { User } from '../users/entities/user.entity/user.entity';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UsersService,
          useValue: createMock<UsersService>,
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
