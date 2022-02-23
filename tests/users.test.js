const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;
const { MongoClient } = require('mongodb');
const server = require('../index');

const { getConnection } = require('./connectionMock');

// POST /users
describe('POST /users', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When user is created', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
          name: "Guilherme",
          username: "guicouto4",
          password: "123456",
          role: "admin"
        });
    });

    it('Return status 201', () => {
      expect(response).to.have.status(201);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "_id", "name", "role" and "token" in the body', () => {
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('role');
      expect(response.body).to.have.property('token');
    });
  });

  describe('When the field "name" is not a string type', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
          name: 123456,
          username: "guicouto4",
          password: "123456",
          role: "admin"
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

    it('Property "message" have the value: "\"name\" must be a string"', () => {
      expect(response.body.message).to.be.equals('"name" must be a string');
    });
  });

  describe('When there is no field "name"', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
          username: "guicouto4",
          password: "123456",
          role: "admin"
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

    it('Property "message" have the value: "\"name\" is required"', () => {
      expect(response.body.message).to.be.equals('"name" is required');
    });
  });

  describe('When the field "username" is not a string type', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
          name: "Guilherme",
          username: 123456,
          password: "123456",
          role: "admin"
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

    it('Property "message" have the value: "\"username\" must be a string', () => {
      expect(response.body.message).to.be.equals('"username" must be a string');
    });
  });

  describe('When there is no field "username"', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
          name: "Guilherme",
          password: "123456",
          role: "admin"
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

    it('Property "message" have the value: "\"username\" is required"', () => {
      expect(response.body.message).to.be.equals('"username" is required');
    });
  });

  describe('When the field "password" is not a string type', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
          name: "Guilherme",
          username: "guicouto4",
          password: 123456,
          role: "admin"
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
        .post('/users')
        .send({
          name: "Guilherme",
          username: "guicouto4",
          role: "admin"
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

  describe('When there is no field "role"', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
          name: "Guilherme",
          username: "guicouto4",
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

    it('Property "message" have the value: "\"role\" is required"', () => {
      expect(response.body.message).to.be.equals('"role" is required');
    });
  });

  describe('When the field "role" is different than "admin" or "user"', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users')
        .send({
          name: "Guilherme",
          username: "guicouto4",
          password: "123456",
          role: "adminn"
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

    it('Property "message" have the value: "\"role\" must be one of [admin, user]"', () => {
      expect(response.body.message).to.be.equals("\"role\" must be one of [admin, user]");
    });
  });
});

describe('GET /users', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When the request is a success', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .get(`/users/`);
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an array', () => {
      expect(response.body).to.be.an('array');
    })
  })
});