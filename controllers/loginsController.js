const { validateLogin, verifyPassword, newLogin } = require("../services/loginsService");

const addLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    validateLogin(req.body);
    await verifyPassword(username, password);
    const token = await newLogin(username, password);

    return res.status(201).json({token});
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  addLogin
}