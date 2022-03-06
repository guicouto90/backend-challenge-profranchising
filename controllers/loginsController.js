const { newLogin } = require("../services/loginsService");

const addLogin = async (req, res, next) => {
  try {
    const token = await newLogin(req.body);

    return res.status(201).json({token});
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  addLogin
}