const { ObjectId } = require("mongodb")

const validateId = (id, type) => {
  const valid = ObjectId.isValid(id);

  if(valid === false) {
    const error = { status: 400, message: `${type} Id is not valid` };
    throw error;
  }
};

module.exports = validateId;
