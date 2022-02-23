const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;
const { MongoClient } = require('mongodb');
const server = require('../index');

const { getConnection } = require('./connectionMock');

// POST /login
describe('POST /login', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When login is done', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock.db('ProFranchising').collection('users');
      await usersCollection.insertOne({ username: "guicouto5", password: "123456"})
      response = await chai.request(server)
        .post('/login')
        .send({
          username: "guicouto5",
          password: "123456",
        });
    });

    it('Return status 201', () => {
      console.log(response.status);
      expect(response).to.have.status(201);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "token" in the body', () => {
      expect(response.body).to.have.property('token');
    });
  });

  describe('When the field "username" is not a string type', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
          username: 123456,
          password: "123456",
        });
    });

    it('Return status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"username\" must be a string"', () => {
      expect(response.body.message).to.be.equals('"username" must be a string');
    });
  });

  describe('When there is no field "username"', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
          password: "123456",
        });
    });

    it('Return status 400', () => {
      console.log(response.body)
      expect(response).to.have.status(400);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"username\" is required"', () => {
      expect(response.body.message).to.be.equals('"username" is required');
    });
  });

  describe('When the field "password" is not a string type', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
          username: "123456",
          password: 123456,
        });
    });

    it('Return status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"password\" must be a string', () => {
      expect(response.body.message).to.be.equals('"password" must be a string');
    });
  });

  describe('When there is no field "password"', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
          username: "guicouto5",
        });
    });

    it('Return status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "\"password\" is required"', () => {
      expect(response.body.message).to.be.equals('"password" is required');
    });
  });

  describe('When "password" or "username" is invalid', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
          username: "guicouto5",
          password: "1234567",
        });
    });

    it('Return status 400', () => {
      expect(response).to.have.status(400);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "Username and/or password invalid"', () => {
      expect(response.body.message).to.be.equals('Username and/or password invalid');
    });
  });
});