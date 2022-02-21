const connection = require('./connection');

const findAllUsers = async() => {
  const connect = await connection();
  const result = await connect.collection('users').find({}).toArray();

  return result;
};

const createUser = async(name, username, password, role) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('users').insertOne({ name, username, password, role });

  return insertedId;
};

const findUserByUsername = async(username) => {
  const connect = await connection();
  const result = await connect.collection('users').findOne({ username });

  return result;
};

module.exports = {
  findUserByUsername,
  createUser,
  findAllUsers
}