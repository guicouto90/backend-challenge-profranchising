const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;
const { MongoClient } = require('mongodb');
const server = require('../index');

const { getConnection } = require('./connectionMock');
const { generateToken } = require('../middlewares/auth');

// POST /ingredients
describe('POST /ingredients', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When ingredient is created', () => {
    let response;
    before(async () => {
      const userCollection = connectionMock.db('ProFranchising').collection('users');
      await userCollection.insertOne({
        name: "Guilherme",
          username: "guicouto6",
          password: "123456",
          role: "admin"
      });

      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .post('/ingredients')
        .set('authorization', token)
        .send({
          name: "Café",
          unity: "kg",
          price: 4
        });
    });

    it('Return status 201', () => {
      expect(response).to.have.status(201);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "_id", "name", "unity" and "price" in the body', () => {
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('unity');
      expect(response.body).to.have.property('price');
    });
  });

  describe('When there is no token', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post(`/ingredients/`)
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
        .post(`/ingredients/`)
        .set('authorization', '123456');
    });

    it('Return status 400', () => {
      console.log(response.body)
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

  describe('When the user logged doesnt have permission to post', () => {
    let response;
    before(async () => {
      const userCollection = connectionMock.db('ProFranchising').collection('users');
      await userCollection.insertOne({
        name: "Guilherme",
          username: "guicouto7",
          password: "123456",
          role: "user"
      });
      const token = generateToken('guicouto7')
      response = await chai.request(server)
        .post(`/ingredients/`)
        .set('authorization', token)
        .send({
          name: "Café",
          unity: "kg",
          price: 4
        });
    });

    it('Return status 401', () => {
      expect(response).to.have.status(401);
    });

    it('Return an object', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "Permission denied"', () => {
      expect(response.body.message).to.be.equals('Permission denied');
    });
  });

  describe('When the field "name" is not a string type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/ingredients/`)
        .set('authorization', token)
        .send({
          name: 123456,
          unity: "kg",
          price: 4
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
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/ingredients/`)
        .set('authorization', token)
        .send({
          unity: "kg",
          price: 4
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

  describe('When the field "unity" is not a string type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/ingredients/`)
        .set('authorization', token)
        .send({
          name: "Café",
          unity: 123456,
          price: 4
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

    it('Property "message" have the value: "\"unity\" must be a string', () => {
      expect(response.body.message).to.be.equals('"unity" must be a string');
    });
  });

  describe('When there is no field "unity"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/ingredients/`)
        .set('authorization', token)
        .send({
          name: "Café",
          price: 4
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

    it('Property "message" have the value: "\"unity\" is required"', () => {
      expect(response.body.message).to.be.equals('"unity" is required');
    });
  });

  describe('When field "unity" is differente than "kg", "l" or "un"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/ingredients/`)
        .set('authorization', token)
        .send({
          name: "Café",
          unity: "kgg",
          price: 4
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

    it('Property "message" have the value: "\"unity\" must be filled with \"kg\"(kilograms), \"l\"(liter) or \"un\"(unity)"', () => {
      expect(response.body.message).to.be.equals("\"unity\" must be filled with \"kg\"(kilograms), \"l\"(liter) or \"un\"(unity)");
    });
  });

  describe('When the field "password" is not a number type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/ingredients/`)
        .set('authorization', token)
        .send({
          name: "Café",
          unity: "kg",
          price: "4"
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

    it('Property "message" have the value: "\"price\" must be a number"', () => {
      expect(response.body.message).to.be.equals("\"price\" must be a number");
    });
  });

  describe('When there is no field "price"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/ingredients/`)
        .set('authorization', token)
        .send({
          name: "Café",
          unity: "kg"
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

    it('Property "message" have the value: "\"price\" is required"', () => {
      expect(response.body.message).to.be.equals('"price" is required');
    });
  });
});

// PUT /ingredients/:id
describe('PUT /ingredients', () => {
  let connectionMock;
  let id;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When an ingredient is updated', () => {
    let response;
  
    before(async () => {
      const ingredientsCollection = connectionMock.db('ProFranchising').collection('ingredients');
      const { insertedId } = await ingredientsCollection.insertOne({
        name: "Farinha",
        unity: "kg",
        price: 2
      });
      id = insertedId;

      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .put(`/ingredients/${id}`)
        .set('authorization', token)
        .send({
          name: "Farinha",
          unity: "kg",
          price: 3
        });
    });

    it('Return status 202', () => {
      expect(response).to.have.status(202);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "Ingredient with <id> edited"', () => {
      expect(response.body.message).to.be.equals(`Ingredient with id:${id} edited `);
    });
  });

  describe('When there is no token', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .put(`/ingredients/${id}`)
        .set('authorization', '')
        .send({
          name: "Farinha",
          unity: "kg",
          price: 3
        });

      it('Return status 400', () => {
        console.log(id)
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
    })
  });

  describe('When ID is not valid', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .put(`/ingredients/4565656`)
        .set('authorization', '')
        .send({
          name: "Farinha",
          unity: "kg",
          price: 3
        });

      it('Return status 400', () => {
        console.log(id)
        expect(response).to.have.status(400);
      });

      it('Return an object', () => {
        expect(response.body).to.be.an('object');
      });

      it('return a property "message" in the body', () => {
        expect(response.body).to.have.property('message');
      });

      it('Property "message" have the value: "Ingredient Id is not valid"', () => {
        expect(response.body.message).to.be.equals('Ingredient Id is not valid');
      });
    })
  });

  describe('When ingredient doesnt exist', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .put(`/ingredients/620fe5d6f07d3226e3c03225`)
        .set('authorization', '')
        .send({
          name: "Farinha",
          unity: "kg",
          price: 3
        });

      it('Return status 400', () => {
        console.log(id)
        expect(response).to.have.status(400);
      });

      it('Return an object', () => {
        expect(response.body).to.be.an('object');
      });

      it('return a property "message" in the body', () => {
        expect(response.body).to.have.property('message');
      });

      it('Property "message" have the value: "Ingredient not found"', () => {
        expect(response.body.message).to.be.equals('Ingredient not found');
      });
    })
  });


  describe('When there token is invalid', () => {
    let response;
    before(async () => {
     response = await chai.request(server)
        .put(`/ingredients/${id}`)
        .set('authorization', 123456)
        .send({
          name: "Farinha",
          unity: "kg",
          price: 3
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
  });

  describe('When the user logged doesnt have permission to put', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto7');
      response = await chai.request(server)
        .put(`/ingredients/${id}`)
        .set('authorization', token)
        .send({
          name: "Farinha",
          unity: "kg",
          price: 3
        });
    });

    it('Return status 401', () => {
      expect(response).to.have.status(401);
    });

    it('Return an object', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "Permission denied"', () => {
      expect(response.body.message).to.be.equals('Permission denied');
    });
  });

  describe('When the field "name" is not a string type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .put(`/ingredients/${id}`)
        .set('authorization', token)
        .send({
          name: 123456,
          unity: "kg",
          price: 4
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
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .put(`/ingredients/${id}`)
        .set('authorization', token)
        .send({
          unity: "kg",
          price: 4
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

  describe('When the field "unity" is not a string type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .put(`/ingredients/${id}`)
        .set('authorization', token)
        .send({
          name: "Café",
          unity: 123456,
          price: 4
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

    it('Property "message" have the value: "\"unity\" must be a string', () => {
      expect(response.body.message).to.be.equals('"unity" must be a string');
    });
  });

  describe('When there is no field "unity"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .put(`/ingredients/${id}`)
        .set('authorization', token)
        .send({
          name: "Café",
          price: 4
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

    it('Property "message" have the value: "\"unity\" is required"', () => {
      expect(response.body.message).to.be.equals('"unity" is required');
    });
  });

  describe('When field "unity" is differente than "kg", "l" or "un"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .put(`/ingredients/${id}`)
        .set('authorization', token)
        .send({
          name: "Café",
          unity: "kgg",
          price: 4
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

    it('Property "message" have the value: "\"unity\" must be filled with \"kg\"(kilograms), \"l\"(liter) or \"un\"(unity)"', () => {
      expect(response.body.message).to.be.equals("\"unity\" must be filled with \"kg\"(kilograms), \"l\"(liter) or \"un\"(unity)");
    });
  });

  describe('When the field "password" is not a number type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .put(`/ingredients/${id}`)
        .set('authorization', token)
        .send({
          name: "Café",
          unity: "kg",
          price: "4"
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

    it('Property "message" have the value: "\"price\" must be a number"', () => {
      expect(response.body.message).to.be.equals("\"price\" must be a number");
    });
  });

  describe('When there is no field "price"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .put(`/ingredients/${id}`)
        .set('authorization', token)
        .send({
          name: "Café",
          unity: "kg"
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

    it('Property "message" have the value: "\"price\" is required"', () => {
      expect(response.body.message).to.be.equals('"price" is required');
    });
  });
});

// DELETE /ingredients/:id
describe('delete /ingredients', () => {
  let connectionMock;
  let id;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When an ingredient is deleted', () => {
    let response;
  
    before(async () => {
      const ingredientsCollection = connectionMock.db('ProFranchising').collection('ingredients');
      const { insertedId } = await ingredientsCollection.insertOne({
        name: "Arroz",
        unity: "kg",
        price: 5
      });
      id = insertedId;

      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .delete(`/ingredients/${id}`)
        .set('authorization', token);
    });

    it('Return status 202', () => {
      expect(response).to.have.status(202);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "Ingredient with <id> deleted"', () => {
      expect(response.body.message).to.be.equals(`Ingredient with id:${id} deleted `);
    });
  });

  describe('When there is no token', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .delete(`/ingredients/${id}`)
        .set('authorization', '');

      it('Return status 400', () => {
        console.log(id)
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
    })
  });

  describe('When ID is not valid', () => {
    let response;
    
    before(async () => {
      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .delete(`/ingredients/4565656`)
        .set('authorization', token);

      it('Return status 400', () => {
        expect(response).to.have.status(400);
      });

      it('Return an object', () => {
        expect(response.body).to.be.an('object');
      });

      it('return a property "message" in the body', () => {
        expect(response.body).to.have.property('message');
      });

      it('Property "message" have the value: "Ingredient Id is not valid"', () => {
        expect(response.body.message).to.be.equals('Ingredient Id is not valid');
      });
    })
  });

  describe('When ingredient doesnt exist', () => {
    let response;
    
    before(async () => {
      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .delete(`/ingredients/620fe5d6f07d3226e3c03225`)
        .set('authorization', token);

      it('Return status 400', () => {
        console.log(id)
        expect(response).to.have.status(400);
      });

      it('Return an object', () => {
        expect(response.body).to.be.an('object');
      });

      it('return a property "message" in the body', () => {
        expect(response.body).to.have.property('message');
      });

      it('Property "message" have the value: "Ingredient not found"', () => {
        expect(response.body.message).to.be.equals('Ingredient not found');
      });
    })
  });


  describe('When there token is invalid', () => {
    let response;
    before(async () => {
     response = await chai.request(server)
        .delete(`/ingredients/${id}`)
        .set('authorization', 123456);

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
  });

  describe('When the user logged doesnt have permission to delete', () => {
    let response;
    before(async () => {
      const ingredientsCollection = connectionMock.db('ProFranchising').collection('ingredients');
      const { insertedId } = await ingredientsCollection.insertOne({
        name: "Arroz",
        unity: "kg",
        price: 5
      });

      id = insertedId;
      const token = generateToken('guicouto7');
      response = await chai.request(server)
        .delete(`/ingredients/${id}`)
        .set('authorization', token);
    });

    it('Return status 401', () => {
      expect(response).to.have.status(401);
    });

    it('Return an object', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "Permission denied"', () => {
      expect(response.body.message).to.be.equals('Permission denied');
    });
  });
});

// GET /ingredients
describe('GET /ingredients', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When request is succesfully', () => {
    let response;
  
    before(async () => {
      const ingredientsCollection = connectionMock.db('ProFranchising').collection('ingredients');
      const { insertedId } = await ingredientsCollection.insertOne({
        _id: '620fe5d6f07d3226e3c03225',
        name: "Feijao",
        unity: "kg",
        price: 2
      });
      id = insertedId;

      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .get(`/ingredients/`)
        .set('authorization', token)
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an array in the body', () => {
      expect(response.body).to.be.an('array');
    });

    it('return a property "_id", "name", "unity", "price" in the body', () => {
      expect(response.body[0]).to.have.property('_id');
      expect(response.body[0]).to.have.property('name');
      expect(response.body[0]).to.have.property('unity');
      expect(response.body[0]).to.have.property('price');
    });
  });

  describe('When there is no token', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .get(`/ingredients/`)
        .set('authorization', '')

      it('Return status 400', () => {
        console.log(id)
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
    })
  });

  describe('When there token is invalid', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .get(`/ingredients/`)
        .set('authorization', '123456');
    });

    it('Return status 400', () => {
      console.log(response.body)
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
});

// GET /ingredients/:id
describe('GET /ingredients', () => {
  let connectionMock;
  let id;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When request is succesfully', () => {
    let response;
  
    before(async () => {
      const ingredientsCollection = connectionMock.db('ProFranchising').collection('ingredients');
      const { insertedId } = await ingredientsCollection.insertOne({
        _id: id,
        name: "Feijao",
        unity: "kg",
        price: 2
      });
      id = insertedId;

      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .get(`/ingredients/${id}`)
        .set('authorization', token)
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "_id", "name", "unity", "price" in the body', () => {
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('unity');
      expect(response.body).to.have.property('price');
    });
  });

  describe('When there is no token', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .get(`/ingredients/${id}`)
        .set('authorization', '')

      it('Return status 400', () => {
        console.log(id)
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
    })
  });

  describe('When there token is invalid', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .get(`/ingredients/${id}`)
        .set('authorization', '123456');
    });

    it('Return status 400', () => {
      console.log(response.body)
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
});