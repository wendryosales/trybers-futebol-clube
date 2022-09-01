import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import { Response } from 'superagent';
import { app } from '../app';
import Match from '../database/models/match.model';
import Team from '../database/models/team.model';
import User from '../database/models/user.model';
import { mockFindOne, userLogin } from './mocks/login';
import { matchesMock, oneMatchMock } from './mocks/matches';
import { teamsMock } from './mocks/teams';


chai.use(chaiHttp);

const { expect } = chai;

describe('⚽Endpoint /matches', () => {
  let chaiHttpResponse: Response;
  describe('GET /matches', () => {
    afterEach(async () => {
      sinon.restore();
    }),
    it('should return a list of matches', async () => {
      sinon.stub(Match, 'findAll').resolves(matchesMock as unknown as Match[]);
      chaiHttpResponse = await chai.request(app).get('/matches');
      expect(chaiHttpResponse.status).to.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(matchesMock);
    }),
    it('should return a list of matches in progress', async () => {
      sinon.stub(Match, 'findAll').resolves(matchesMock as unknown as Match[]);
      chaiHttpResponse = await chai.request(app).get('/matches?inProgress=true');
      expect(chaiHttpResponse.status).to.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(matchesMock);
    }),
    it('should return a list of matches not in progress', async () => {
      sinon.stub(Match, 'findAll').resolves(matchesMock as unknown as Match[]);
      chaiHttpResponse = await chai.request(app).get('/matches?inProgress=false');
      expect(chaiHttpResponse.status).to.equal(200);
      expect(chaiHttpResponse.body).to.deep.equal(matchesMock);
    })
  })
  describe('POST /matches', () => {
    afterEach(async () => {
      sinon.restore();
    }),
    it('create a match', async () => {
      sinon.stub(User, 'findOne').resolves(await mockFindOne() as User);
      sinon.stub(User, 'findByPk').resolves(await mockFindOne() as User);
      const chaiLogin = await chai.request(app).post('/login').send(userLogin);


      sinon.stub(Match, 'create').resolves(matchesMock[0] as unknown as Match);
      sinon.stub(Team, 'findAll').resolves(teamsMock as Team[]);
      chaiHttpResponse = await chai.request(app).post('/matches')
        .set('Authorization', chaiLogin.body.token)
        .send(oneMatchMock);
      expect(chaiHttpResponse.status).to.equal(201);
      expect(chaiHttpResponse.body).to.haveOwnProperty('id');
    }),
    it('return a error if not authorized', async () => {
      chaiHttpResponse = await chai.request(app).post('/matches')
        .send(oneMatchMock);
      expect(chaiHttpResponse.status).to.equal(401);
    }),
    it('return a error if send equal teams', async () => {
      sinon.stub(User, 'findOne').resolves(await mockFindOne() as User);
      sinon.stub(User, 'findByPk').resolves(await mockFindOne() as User);
      const chaiLogin = await chai.request(app).post('/login').send(userLogin);

      chaiHttpResponse = await chai.request(app).post('/matches')
        .set('Authorization', chaiLogin.body.token)
        .send({
          ...oneMatchMock,
          teamHome: 1,
          teamAway: 1,
        });
      expect(chaiHttpResponse.status).to.equal(401);
    }),
    it('return a error if the team not exists', async () => {
      sinon.stub(User, 'findOne').resolves(await mockFindOne() as User);
      sinon.stub(User, 'findByPk').resolves(await mockFindOne() as User);
      const chaiLogin = await chai.request(app).post('/login').send(userLogin);

      sinon.stub(Team, 'findByPk').resolves(undefined);
      chaiHttpResponse = await chai.request(app).post('/matches')
        .set('Authorization', chaiLogin.body.token)
        .send({
          ...oneMatchMock,
          teamHome: 100,
          teamAway: 99,
        });
      expect(chaiHttpResponse.status).to.equal(404);
    })
  })
  describe('PATCH /matches/:id/finish', () => {
    afterEach(async () => {
      sinon.restore();
    }),
    it('finish a match', async () => {
      sinon.stub(User, 'findOne').resolves(await mockFindOne() as User);
      sinon.stub(User, 'findByPk').resolves(await mockFindOne() as User);
      const chaiLogin = await chai.request(app).post('/login').send(userLogin);

      sinon.stub(Match, 'findByPk').resolves(matchesMock[0] as unknown as Match);
      chaiHttpResponse = await chai.request(app)
      .patch('/matches/1/finish')
      .set('Authorization', chaiLogin.body.token)
      expect(chaiHttpResponse.status).to.equal(200);
      expect(chaiHttpResponse.body).to.haveOwnProperty('message')
    })
  })
})
