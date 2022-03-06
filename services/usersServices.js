const Joi = require('@hapi/joi');
const { generateToken } = require('../middlewares/auth');
const { createUser, findAllUsers, findUserByUsername } = require('../models/usersModel');

const usersSchema = Joi.object({
  name: Joi.string().required().min(2).not().empty(),
  username: Joi.string().required().min(2).not().empty(),
  password: Joi.string().required().min(6).not().empty(),
  role: Joi.string().valid('admin','user').required(),
});

const validateUser = (body) => {
  const { name, username, password, role } = body;
  const { error } = usersSchema.validate({ name, username, password, role });
  if(error) throw error;
};

const getAllUsers = async() => {
  const result = await findAllUsers();

  return result;
};

const getUserByUsername = async(userName) => {
  const result = await findUserByUsername(userName);
  if(!result) {
    const error = { status: 404, message: 'User not found' };
    throw error;
  }

  return result;
};

const verifyUsername = async(username) => {
  const user = await findUserByUsername(username);
  if(user) {
    const error = { status: 400, message: 'Username already exists.' };
    throw error;
  }
};

const verifyAdmin = async(username) => {
  const { role } = await findUserByUsername(username);
  if(role === 'user') {
    const error = { status: 401, message: 'Permission denied'};
    throw error;
  }
};

const newUser = async(body) => {
  const { name, username, password, role } = body;
  validateUser(body);
  await verifyUsername(username);
  const userId = await createUser(name, username, password, role);
  const token = generateToken(username);
  const newUser = {
    _id: userId,
    name, 
    username, 
    role,
    token
  }

  return newUser;
};

module.exports = {
  validateUser,
  newUser,
  getAllUsers,
  getUserByUsername,
  verifyUsername,
  verifyAdmin
}
