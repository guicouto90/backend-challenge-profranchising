const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;
const { MongoClient } = require('mongodb');
const server = require('../index');

const { getConnection } = require('./connectionMock');
const { generateToken } = require('../middlewares/auth');

// POST /products
describe('POST /products', () => {
  let connectionMock;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When products is created', () => {
    let response;
    before(async () => {
      const userCollection = connectionMock.db('ProFranchising').collection('users');
      await userCollection.insertOne({
        name: "Guilherme",
        username: "guicouto6",
        password: "123456",
        role: "admin"
      });

      const ingredientsCollection = connectionMock.db('ProFranchising').collection('ingredients');
      await ingredientsCollection.insertOne({
        name: "Café",
        unity: "kg",
        price: 4,
      })

      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .post('/products')
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 15,
          quantity: 5,
          ingredients: [
              {
                name: "Café",
                quantity: 0.25
              }
          ]
        });
    });

    it('Return status 201', () => {
      console.log(response.body)
      expect(response).to.have.status(201);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "_id", "name", "quantity", "price" and "ingredients" in the body', () => {
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('price');
      expect(response.body).to.have.property('quantity');
      expect(response.body).to.have.property('ingredients');
    });
  });

  describe('When there is no token', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post(`/products/`)
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
        .post(`/products/`)
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
        .post(`/products/`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 15,
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.25
            }
          ]
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

  describe('When you try to register a product with a ingredient not regitered', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto')
      response = await chai.request(server)
        .post(`/products/`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 15,
          quantity: 5,
          ingredients: [
            {
              name: "Leite",
              quantity: 0.25
            }
          ]
        });
    });

    it('Return status 404', () => {
      expect(response).to.have.status(404);
    });

    it('Return an object', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "message" in the body', () => {
      expect(response.body).to.have.property('message');
    });

    it('Property "message" have the value: "Ingredient with name Leite not found"', () => {
      expect(response.body.message).to.be.equals('Ingredient with name Leite not found');
    });
  });

  describe('When the field "name" is not a string type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/products/`)
        .set('authorization', token)
        .send({
          name: 45454,
          price: 15,
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.25
            }
          ]
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
        .post(`/products/`)
        .set('authorization', token)
        .send({
          price: 15,
          quantity: 5,
          ingredients: [
            {
              name: "Leite",
              quantity: 0.25
            }
          ]
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

  describe('When the field "price" is not a number type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/products/`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: '15',
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.25
            }
          ]
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

    it('Property "message" have the value: "\"price\" must be a number', () => {
      expect(response.body.message).to.be.equals('"price" must be a number');
    });
  });

  describe('When there is no field "price"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/products/`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.25
            }
          ]
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

  describe('When the field "quantity" is not a number type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/products/`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 15,
          quantity: '5',
          ingredients: [
            {
              name: "Café",
              quantity: 0.25
            }
          ]
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

    it('Property "message" have the value: "\"quantity\" must be a number', () => {
      expect(response.body.message).to.be.equals('"quantity" must be a number');
    });
  });

  describe('When there is no field "quantity"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/products/`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.25
            }
          ]
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

    it('Property "message" have the value: "\"quantity\" is required"', () => {
      expect(response.body.message).to.be.equals('"quantity" is required');
    });
  });

  describe('When the field "ingredients" is not an array type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/products/`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 15,
          quantity: 5,
          ingredients: 456,
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

    it('Property "message" have the value: "\"ingredients\" must be an array"', () => {
      expect(response.body.message).to.be.equals("\"ingredients\" must be an array");
    });
  });

  describe('When there is no field "ingredients"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/products/`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 15,
          quantity: 5,
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

    it('Property "message" have the value: "\"ingredients\" is required"', () => {
      expect(response.body.message).to.be.equals('"ingredients" is required');
    });
  });
});

// PUT /products/:id
describe('PUT /products/:id', () => {
  let connectionMock;
  let id;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When an products is updated', () => {
    let response;
  
    before(async () => {
      const ingredientsCollection = connectionMock.db('ProFranchising').collection('products');
      const { insertedId } = await ingredientsCollection.insertOne({
        name: "Copo de café",
        price: 15,
        quantity: 5,
        ingredients: [
          {
            name: "Café",
            quantity: 0.25
          }
        ]
      });
      id = insertedId;

      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .put(`/products/${id}`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 15,
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.35
            }
          ]
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

    it('Property "message" have the value: "Product with <id> updated"', () => {
      expect(response.body.message).to.be.equals(`Product with id:${id} updated`);
    });
  });

  describe('When there is no token', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .put(`/products/${id}`)
        .set('authorization', '')
        .send({
          name: "Copo de café",
          price: 15,
          ingredients: [
            {
              name: "Café",
              quantity: 0.35
            }
          ]
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
        .put(`/products/4565656`)
        .set('authorization', '')
        .send({
          name: "Copo de café",
          price: 15,
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.35
            }
          ]
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

  describe('When product doesnt exist', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .put(`/products/620fe5d6f07d3226e3c03225`)
        .set('authorization', '')
        .send({
          name: "Copo de café",
          price: 15,
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.35
            }
          ]
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
        .put(`/products/${id}`)
        .set('authorization', 123456)
        .send({
          name: "Copo de café",
          price: 15,
          ingredients: [
            {
              name: "Café",
              quantity: 0.35
            }
          ]
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
        .put(`/products/${id}`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 15,
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.35
            }
          ]
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
        .put(`/products/${id}`)
        .set('authorization', token)
        .send({
          name: 45656,
          price: 15,
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.35
            }
          ]
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
        .put(`/products/${id}`)
        .set('authorization', token)
        .send({
          price: 15,
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.35
            }
          ]
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

  describe('When the field "price" is not a number type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .put(`/products/${id}`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: '15',
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.35
            }
          ]
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

    it('Property "message" have the value: "\"price\" must be a number', () => {
      expect(response.body.message).to.be.equals('"price" must be a number');
    });
  });

  describe('When there is no field "price"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .put(`/products/${id}`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          quantity: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.35
            }
          ]
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

  describe('When the field "ingredients" is not a array type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .put(`/products/${id}`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 15,
          quantity: 5,
          ingredients: 445656
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

    it('Property "message" have the value: "\"ingredients\" must be an array"', () => {
      expect(response.body.message).to.be.equals("\"ingredients\" must be an array");
    });
  });

  describe('When there is no field "ingredients"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .put(`/products/${id}`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 15,
          quantity: 5,
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

    it('Property "message" have the value: "\"ingredients\" is required"', () => {
      expect(response.body.message).to.be.equals('"ingredients" is required');
    });
  });

  describe('When the field "quantity" is not a number type', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/products/`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 15,
          quantity: '5',
          ingredients: [
            {
              name: "Café",
              quantity: 0.25
            }
          ]
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

    it('Property "message" have the value: "\"quantity\" must be a number', () => {
      expect(response.body.message).to.be.equals('"quantity" must be a number');
    });
  });

  describe('When there is no field "quantity"', () => {
    let response;
    before(async () => {
      const token = generateToken('guicouto6')
      response = await chai.request(server)
        .post(`/products/`)
        .set('authorization', token)
        .send({
          name: "Copo de café",
          price: 5,
          ingredients: [
            {
              name: "Café",
              quantity: 0.25
            }
          ]
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

    it('Property "message" have the value: "\"quantity\" is required"', () => {
      expect(response.body.message).to.be.equals('"quantity" is required');
    });
  });
});

// DELETE /products/:id
describe('delete /products', () => {
  let connectionMock;
  let id;

  before(async () => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after(() => {
    MongoClient.connect.restore();
  });

  describe('When an product is deleted', () => {
    let response;
  
    before(async () => {
      const productsCollection = connectionMock.db('ProFranchising').collection('products');
      const { insertedId } = await productsCollection.insertOne({
        name: "Bolo de café",
        price: 15,
        ingredients: [
          {
            name: "Café",
            quantity: 1
          }
        ]
      });
      id = insertedId;

      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .delete(`/products/${id}`)
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

    it('Property "message" have the value: "Product with <id> deleted"', () => {
      expect(response.body.message).to.be.equals(`Product with id:${id} deleted`);
    });
  });

  describe('When there is no token', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .delete(`/products/${id}`)
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
        .delete(`/products/4565656`)
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

  describe('When product doesnt exist', () => {
    let response;
    
    before(async () => {
      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .delete(`/products/620fe5d6f07d3226e3c03225`)
        .set('authorization', token);

      it('Return status 404', () => {
        console.log(id)
        expect(response).to.have.status(404);
      });

      it('Return an object', () => {
        expect(response.body).to.be.an('object');
      });

      it('return a property "message" in the body', () => {
        expect(response.body).to.have.property('message');
      });

      it('Property "message" have the value: "Product not found"', () => {
        expect(response.body.message).to.be.equals('Product not found');
      });
    })
  });

  describe('When there token is invalid', () => {
    let response;
    before(async () => {
     response = await chai.request(server)
        .delete(`/products/${id}`)
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
      const productsCollection = connectionMock.db('ProFranchising').collection('products');
      const { insertedId } = await productsCollection.insertOne({
        name: "Copo de café grande",
        price: 17,
        ingredients: [
          {
            name: "Café",
            quantity: 0.5
          }
        ]
      });

      id = insertedId;
      const token = generateToken('guicouto7');
      response = await chai.request(server)
        .delete(`/products/${id}`)
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

// GET /products
describe('GET /products', () => {
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
      const productsCollection = connectionMock.db('ProFranchising').collection('products');
      const { insertedId } = await productsCollection.insertOne({
        name: "Bolo de café",
        price: 15,
        quantity: 5,
        ingredients: [
          {
            name: "Café",
            quantity: 1
          }
        ]
      });
      id = insertedId;

      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .get(`/products/`)
        .set('authorization', token)
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an array in the body', () => {
      expect(response.body).to.be.an('array');
    });

    it('return a property "_id", "name", "price", "quantity" and "ingredients" in the body', () => {
      expect(response.body[0]).to.have.property('_id');
      expect(response.body[0]).to.have.property('name');
      expect(response.body[0]).to.have.property('price');
      expect(response.body[0]).to.have.property('quantity');
      expect(response.body[0]).to.have.property('ingredients');
    });
  });

  describe('When there is no token', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .get(`/products/`)
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
        .get(`/products/`)
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

// GET /products/:id
describe('GET /products/:id', () => {
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
      const productsCollection = connectionMock.db('ProFranchising').collection('products');
      const { insertedId } = await productsCollection.insertOne({
        name: "Bolo de café",
        price: 15,
        quantity: 5,
        ingredients: [
          {
            name: "Café",
            quantity: 1
          }
        ]
      });
      id = insertedId;
      const token = generateToken('guicouto6');
      response = await chai.request(server)
        .get(`/products/${id}`)
        .set('authorization', token)
    });

    it('Return status 200', () => {
      expect(response).to.have.status(200);
    });

    it('Return an object in the body', () => {
      expect(response.body).to.be.an('object');
    });

    it('return a property "_id", "name", "quantity" "price", "ingredients" in the body', () => {
      expect(response.body).to.have.property('_id');
      expect(response.body).to.have.property('name');
      expect(response.body).to.have.property('price');
      expect(response.body).to.have.property('quantity');
      expect(response.body).to.have.property('ingredients');
    });
  });

  describe('When there is no token', () => {
    let response;
    
    before(async () => {
      response = await chai.request(server)
        .get(`/products/${id}`)
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
        .get(`/products/${id}`)
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