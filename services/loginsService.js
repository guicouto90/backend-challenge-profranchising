const Joi = require('@hapi/joi');
const { generateToken } = require('../middlewares/auth');
const { createLogin } = require('../models/loginsModel');
const { findUserByUsername } = require('../models/usersModel');

const loginSchema = Joi.object({
  username: Joi.string().required().min(2).not().empty(),
  password: Joi.string().required().min(6).not().empty(),
});

const validateLogin = (body) => {
  const { username, password } = body;
  const { error } = loginSchema.validate({username, password});
  if(error) throw error;
};

const verifyPassword = async(username, password) => {
  const user = await findUserByUsername(username);
  if(!user || user.password !== password) {
    const error = { status: 400, message: 'Username and/or password invalid'}
    throw error;
  }
};

const newLogin = async(username, password) => {
  await createLogin(username, password);
  const token = generateToken(username);

  return token;
};

module.exports = {
  validateLogin,
  verifyPassword,
  newLogin
}