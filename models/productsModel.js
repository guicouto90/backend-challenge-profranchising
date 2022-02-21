const { ObjectId } = require('mongodb');
const connection = require('./connection');

const createProduct = async(name, price, ingredients) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('products').insertOne({ name, price, ingredients });
  
  return insertedId;
};

const insertImage = async(id, image) => {
  const connect = await connection();
  await connect.collection('products').updateOne(
    { _id: ObjectId(id) },
    { $set: { image } }
  );
}

const findAllProducts = async() => {
  const connect = await connection();
  const result = await connect.collection('products').find().toArray();
  
  return result
};

const findProductById = async(id) => { 
  const connect = await connection();
  const result = await connect.collection('products').findOne({ _id: ObjectId(id) });

  return result;
}

const updateProducts = async(id, name, price, ingredients) => {
  const connect = await connection();
  await connect.collection('products').updateOne(
    { _id: ObjectId(id) },
    { $set: { name, price, ingredients } }
  )
};

const deleteProduct = async(id) => {
  const connect = await connection();
  await connect.collection('products').deleteOne({_id: ObjectId(id) });
};

module.exports = {
  createProduct,
  insertImage,
  findAllProducts,
  updateProducts,
  findProductById,
  deleteProduct,
}