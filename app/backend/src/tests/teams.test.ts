import * as chai from 'chai';
import * as sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');

import { Response } from 'superagent';
import { app } from '../app';

import Team from '../database/models/team.model';
import { teamsMock } from './mocks/teams';

chai.use(chaiHttp);

const { expect } = chai;

describe('⚽Endpoint /teams', () => {
  let chaiHttpResponse: Response;
  describe('GET /teams', () => {
    afterEach(async () => {
      sinon.restore();
    }),
    it('should return a list of teams', async () => {
      sinon.stub(Team, 'findAll').resolves(teamsMock as Team[]);
      chaiHttpResponse = await chai.request(app).get('/teams');
      expect(chaiHttpResponse.status).to.equal(200);
      expect(chaiHttpResponse.body).to.be.an('array');
      expect(chaiHttpResponse.body).to.have.lengthOf(teamsMock.length);
    }),
    it('should return just only team if id is passed', async () => {
      sinon.stub(Team, 'findByPk').resolves(teamsMock[0] as Team);
      chaiHttpResponse = await chai.request(app).get('/teams/1');
      expect(chaiHttpResponse.status).to.equal(200);
      expect(chaiHttpResponse.body).to.be.an('object');
      expect(chaiHttpResponse.body).to.have.property('id', 1);
      expect(chaiHttpResponse.body).to.have.property('teamName', 'Avaí/Kindermann');
    })
  })
  }
)