const connection = require('./connection');
const { ObjectId, ObjectID } = require('mongodb');

const createIngredient = async(name, unity, price) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('ingredients').insertOne({ name, unity, price });

  return insertedId;
};

const findAllIngredients = async() => {
  const connect = await connection();
  const result = await connect.collection('ingredients').find({}).toArray();

  return result;
};

const findIngredientById = async(id) => {
  const connect = await connection();
  const result = await connect.collection('ingredients').findOne({ _id: ObjectId(id) });

  return result;
};

const updateIngredient = async(id, name, unity, price) => {
  const connect = await connection();
  await connect.collection('ingredients').updateOne(
    {_id: ObjectId(id)},
    { $set: { name, unity, price} }
  )
};

const deleteIngredient = async(id) => {
  const connect = await connection();
  await connect.collection('ingredients').deleteOne({ _id: ObjectId(id) })

  return deleteIngredient;
}

module.exports = {
  createIngredient,
  findAllIngredients,
  findIngredientById,
  updateIngredient,
  deleteIngredient,
};