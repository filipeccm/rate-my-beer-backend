import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/v1/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthSignupDto } from '../src/v1/auth/dto/signup.dto';
import { UpdateUserDto } from '../src/v1/users/dto/update-user.dto';
import { CreateBeerDto } from '../src/v1/beers/dto/create-beer.dto';

describe('app e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthSignupDto = {
      email: 'test@gmail.com',
      password: '123',
    };

    describe('Signup', () => {
      const endpoint = '/auth/signup';
      it('should throw exception if email is empty', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody({
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw exception if password is empty', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody({
            email: dto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw exception if body is empty', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody({})
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('Signin', () => {
      const endpoint = '/auth/signin';
      it('should throw exception if email is empty', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody({
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw exception if password is empty', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody({
            email: dto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw exception if body is empty', () => {
        return pactum.spec().post(endpoint).withBody({}).expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should throw exception if empty auth', () => {
        return pactum
          .spec()
          .get('/users/me')
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should throw exception if invalid jwt', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer fakejwt' })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should get logged user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Edit user', () => {
      const updateDto: UpdateUserDto = {
        name: 'Updated',
        email: 'test@hotmail.com',
      };
      it('should throw exception if unauthorized', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer fakejwt' })
          .withBody(updateDto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(updateDto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(updateDto.name)
          .expectBodyContains(updateDto.email);
      });
    });
  });

  describe('Beer', () => {
    describe('Create Beer', () => {
      const dto: CreateBeerDto = {
        name: 'Guinness',
        description: 'Best irish beer ever',
      };
      it('should create a beer', () => {
        return pactum
          .spec()
          .post('/beers')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED)
          .stores('createdBeerId', 'id');
      });
    });
    describe('Get Beer', () => {
      it('should get all beers', () => {
        return pactum.spec().get('/beers').expectStatus(HttpStatus.OK);
      });
    });
    describe('Get Beer By Id', () => {
      const beerId = '$S{createdBeerId}';
      it('should throw not found exception if beer does not exist', () => {
        return pactum
          .spec()
          .get('/beers/1295124')
          .expectStatus(HttpStatus.NOT_FOUND);
      });
      it('should get a beer by id', () => {
        return pactum
          .spec()
          .get(`/beers/${beerId}`)
          .expectStatus(HttpStatus.OK);
      });
    });
  });

  describe('Userslikedbeers', () => {
    const beerId = '$S{createdBeerId}';
    describe('Create Userslikedbeers', () => {
      it('should throw error if beer does not exist', () => {
        return pactum
          .spec()
          .post('/userslikedbeers')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ beerId })
          .expectStatus(HttpStatus.CREATED);
      });
      it('should add a new liked beer', () => {
        return pactum
          .spec()
          .post('/userslikedbeers')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ beerId })
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('Delete Userslikedbeers', () => {
      it('should not remove if beer is not liked', () => {
        return pactum
          .spec()
          .delete('/userslikedbeers')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ beerId: 4190 })
          .expectStatus(HttpStatus.NOT_FOUND);
      });
      it('should not remove without auth', () => {
        return pactum
          .spec()
          .delete('/userslikedbeers')
          .withHeaders({ Authorization: 'Bearer fakejwt' })
          .withBody({ beerId })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should remove a previously liked beer', () => {
        return pactum
          .spec()
          .delete('/userslikedbeers')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ beerId })
          .expectStatus(HttpStatus.OK);
      });
    });
  });
});
