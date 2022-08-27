import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import { Response } from 'superagent';
import { app } from '../app';
import User from '../database/models/user.model';
import { mockFindOne, userLogin } from './mocks/login';

chai.use(chaiHttp);

const { expect } = chai;

describe('🚪Endpoint /login', () => {
  let chaiHttpResponse: Response;
  describe('POST /login', () => {
    afterEach(async () => {
      sinon.restore();
    }),
    it('should return a token', async () => {
      sinon.stub(User, 'findOne').resolves(await mockFindOne() as User);
      chaiHttpResponse = await chai.request(app).post('/login').send(userLogin);
      expect(chaiHttpResponse.status).to.equal(200);
      expect(chaiHttpResponse.body).to.have.property('token');
    }),
    it('should return an error if user not found', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      chaiHttpResponse = await chai.request(app).post('/login').send(userLogin);
      expect(chaiHttpResponse.status).to.equal(401);
      expect(chaiHttpResponse.body).to.have.property('message');
    }),
    it('should return an error if password is incorrect', async () => {
      sinon.stub(User, 'findOne').resolves(await mockFindOne() as User);
      chaiHttpResponse = await chai.request(app).post('/login').send({ ...userLogin, password: 'wrong' });
      expect(chaiHttpResponse.status).to.equal(401);
      expect(chaiHttpResponse.body).to.have.property('message');
      expect(chaiHttpResponse.body.message).to.equal('Incorrect email or password');
    }),
    it('should return an error with status 500', async () => {
      sinon.stub(User, 'findOne').rejects(new Error('Error'));
      chaiHttpResponse = await chai.request(app).post('/login').send(userLogin);
      expect(chaiHttpResponse.status).to.equal(500);
      expect(chaiHttpResponse.body).to.have.property('message');
    }),
    it('should return an error with status 400', async () => {
      chaiHttpResponse = await chai.request(app).post('/login').send({ email: 'admin@admin.com'});
      expect(chaiHttpResponse.status).to.equal(400);
      expect(chaiHttpResponse.body).to.have.property('message');
    })
   })
   describe('GET /login/validate', () => {
    afterEach(async () => {
      sinon.restore();
    }),
    it('should return a role', async () => {
      sinon.stub(User, 'findOne').resolves(await mockFindOne() as User);
      sinon.stub(User, 'findByPk').resolves(await mockFindOne() as User);
      const chaiLogin = await chai.request(app).post('/login').send(userLogin);

      chaiHttpResponse = await chai.request(app).get('/login/validate').set('Authorization', chaiLogin.body.token);
      expect(chaiHttpResponse.status).to.equal(200);
      expect(chaiHttpResponse.body).to.have.property('role');
    })
   })
  }
)
