const connection = require('./connection');

const createLogin = async(username, password) => {
  const connect = await connection();
  const date = new Date().toISOString();
  await connect.collection('login').insertOne({username, password, date});
};

module.exports = {
  createLogin,
}