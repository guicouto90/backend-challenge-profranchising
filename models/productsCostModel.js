const connection = require('./connection');

const createCost = async(name, cost) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('costs').insertOne({ name, cost });
  return insertedId;
};

const findAllCosts = async() => {
  const connect = await connection();
  const result = await connect.collection('costs').find().toArray();

  return result;
};

module.exports = {
  createCost,
  findAllCosts,
}