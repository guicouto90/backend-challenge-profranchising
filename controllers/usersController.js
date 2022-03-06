const { getAllUsers, newUser } = require("../services/usersServices");

const listAllUsers = async(req,res,next) => {
  try {
    const result = await getAllUsers();

    return res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
}

const addUser = async(req,res,next) => {
  try {
    const result = await newUser(req.body);

    return res.status(201).json(result);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  listAllUsers,
  addUser
}