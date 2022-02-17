const errorHandler = (err, req, res, next) => {
  if(err.status) return res.status(err.status).json(err.message);
  if(err.details) return res.status(400).json(err.details[0].message);

  return res.status(500).json({message: 'Internal Error'});
};

module.exports = errorHandler;