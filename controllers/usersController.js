const { getAllUsers, validateUser, newUser, verifyUsername } = require("../services/usersServices");

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
    const { name, username, password, role } = req.body;
    validateUser(req.body);
    await verifyUsername(username);
    const result = await newUser(name, username, password, role);

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