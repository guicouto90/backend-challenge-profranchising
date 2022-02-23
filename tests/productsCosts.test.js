const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;
const { MongoClient } = require('mongodb');
const server = require('../index');

const { getConnection } = require('./connectionMock');
const { generateToken } = require('../middlewares/auth');

describe('GET /productscosts', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When there is no token', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .get(`/productscosts/`)
        .set('authorization', '');
    });

    it('Return status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Return an object', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "jwt must be provided"', () => {
      expect(response.body.message).to.be.equals('jwt must be provided');
    });
  });

  describe('When there token is invalid', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .get(`/productscosts/`)
        .set('authorization', '123456');
    });

    it('Return status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Return an object', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "jwt malformed"', () => {
      expect(response.body.message).to.be.equals('jwt malformed');
    });
  });

  describe('When request is succesfull', () => {
    let response;
    before(async () => {
      const costCollection = connectionMock.db('ProFranchising').collection('costs');
      await costCollection.insertOne({
        _id: "62143ca9c5004029005ab982",
        name: "Café com leite",
        cost: 2
      })
      const token = generateToken('guicouto5')
      response = await chai.request(server)
        .get(`/productscosts/`)
        .set('authorization', token);
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an array', () => {
      expect(response.body).to.be.an('array');
    });

    it('return properties "_id", "name", "cost" in the body', () => {
      expect(response.body[0]).to.have.property('_id');
      expect(response.body[0]).to.have.property('name');
      expect(response.body[0]).to.have.property('cost');
    });
  })
});