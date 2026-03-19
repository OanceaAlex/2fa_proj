import { Test, TestingModule } from '@nestjs/testing';
import { HttpServer, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { UsersModule } from '../../src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '../../src/config/app.config';
import { User } from '../../src/users/entities/user.entity/user.entity';
import { CreateUserDto } from '../../src/users/dtos/create-user.dto';
import { AuthenticationModule } from '../../src/authentication/authentication.module';

describe('[Feature] Usesrs - /users', () => {
  let app: INestApplication;
  let httpServer: HttpServer;

  const user : User = {
    id: 123,
    username: 'John Doe',
    email: 'John@Doe.com',
    password: 'pass123',
    twoFactorAuthSecret: null,
    isTwoFactorAuthEnabled: false,
  };

  const userDto : CreateUserDto = {
    username: 'Josh Darn',
    email: 'josh@darn.com',
    password: 'changeme',
  };

  const expectedUser : Partial<User> = {
    username: userDto.username,
    email: userDto.email,
    twoFactorAuthSecret: null,
    isTwoFactorAuthEnabled: false,
  }

  const hashedPassword = bcrypt.hashSync(userDto.password, 10);
  // const expectedUser = {
  //   ...userDto,
  //   password: hashedPassword,
  // }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        AuthenticationModule,
        ConfigModule.forRoot({
            load: [appConfig],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports:[ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('database.host'),
                port: 5433,
                username: configService.get<string>('database.username'),
                database: configService.get<string>('database.name'),
                password: configService.get<string>('database.pass'),
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject:[ConfigService],
        })
    ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
      );
      
    await app.init();
    httpServer = app.getHttpServer();
  });
  
  it('Register user [POST /register]', () => {
    return request(httpServer)
    .post('/users/register')
    .send(userDto as CreateUserDto)
    .expect(HttpStatus.CREATED)
    .then(({ body }) => {
        expect(body).toMatchObject(expectedUser);
    })
  });


  it('get all [GET /]', () => {
    return request(httpServer)
    .get('/users')
    .then(({ body }) => {
        console.log(body);
        expect(body.length).toBeGreaterThan(0);
        expect(body[0]).toEqual(user);
    });
  });
  it.todo('Get one [GET /:id]');
  it.todo('Crate user forced [POST /create]');
  it.todo('Get user Profile [POST /profile]');
  it.todo('update user [PATCH /:id]');
  it.todo('Delete user [DELETE /:id]');

  afterAll(async () => {
    await app.close()
  })
});
