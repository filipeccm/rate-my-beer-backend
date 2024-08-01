import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AppModule } from '../app.module';
import * as pactum from 'pactum';
import { AuthSignupDto } from '../auth/dto/signup.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateBeerDto } from '../beers/dto/create-beer.dto';

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
    app.setGlobalPrefix('v1');
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333/v1');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthSignupDto = {
      name: 'Test User',
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

      it('should throw exception if email is taken', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody(dto)
          .expectStatus(HttpStatus.FORBIDDEN);
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

      it('should throw exception if password is wrong', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody({
            email: dto.email,
            password: '9-52195-21',
          })
          .expectStatus(HttpStatus.UNAUTHORIZED);
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
          .stores('userAt', 'access_token')
          .stores('userId', 'id');
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
        descript: 'Best irish beer ever',
        abv: 1.4,
        ibu: 2,
        srm: 10,
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
      it('should throw error if beer does not exist', () => {
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

  describe('User Likes Beer', () => {
    const beerId = '$S{createdBeerId}';
    const userId = '$S{userId}';
    const endpoint = `/users/${userId}/liked-beers`;

    describe('Like Beer', () => {
      it('should throw error if beer does not exist', () => {
        return pactum
          .spec()
          .post(endpoint + '/' + '12511')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.NOT_FOUND);
      });
      it('should like a beer', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ beerId })
          .expectStatus(HttpStatus.CREATED);
      });
    });

    describe('User Dislikes Beer', () => {
      const deleteEndpoint = endpoint + '/' + beerId;
      it('should throw an error if beer is not liked', () => {
        return pactum
          .spec()
          .delete(endpoint + '/' + '1251')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should not remove without auth', () => {
        return pactum
          .spec()
          .delete(deleteEndpoint)
          .withHeaders({ Authorization: 'Bearer fakejwt' })
          .withBody({ beerId })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should throw error if logged user is not the like author', () => {
        return pactum
          .spec()
          .delete(`/users/42/liked-beers/${beerId}`)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should dislike a previously liked beer', () => {
        return pactum
          .spec()
          .delete(deleteEndpoint)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ beerId })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Get All Beers Liked By User', () => {
      const userId = '$S{userId}';
      const endpoint = `/users/${userId}/liked-beers`;
      it('should return all beers', () => {
        return pactum.spec().get(endpoint).expectStatus(HttpStatus.OK);
      });
    });
  });

  describe('User Rates Beer', () => {
    const beerId = '$S{createdBeerId}';
    const userId = '$S{userId}';
    const rating = 4;
    const endpoint = `/users/${userId}/rated-beers`;
    const body = { rating };
    describe('Create Beer Rating', () => {
      it('should throw error if beer does not exist', () => {
        return pactum
          .spec()
          .put(endpoint + '/52151')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(body)
          .expectStatus(HttpStatus.BAD_REQUEST)
          .inspect();
      });

      it('should throw error if logged user is not the rating author', () => {
        return pactum
          .spec()
          .put(`/users/2141/rated-beers/${beerId}`)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(body)
          .expectStatus(HttpStatus.UNAUTHORIZED)
          .inspect();
      });

      it('should rate a beer', () => {
        return pactum
          .spec()
          .put(endpoint + '/' + beerId)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(body)
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Delete Beer Rating', () => {
      it('should not remove rating if beer is not rated by user', () => {
        return pactum
          .spec()
          .delete(`/users/2141/rated-beers/${beerId}`)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });
      it('should not rate without auth', () => {
        return pactum
          .spec()
          .delete(`/users/2141/rated-beers/${beerId}`)
          .withHeaders({ Authorization: 'Bearer fakejwt' })
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should remove rating', () => {
        return pactum
          .spec()
          .delete(endpoint + '/' + beerId)
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(HttpStatus.OK);
      });
    });
  });
});
