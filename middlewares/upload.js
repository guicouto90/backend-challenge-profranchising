const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, (path.resolve(__dirname, '..', 'uploads')))
  },
  filename: (req, file, callback) => {
    const { id } = req.params;
    callback(null, `${id}.jpg`);
  },
});

const upload = multer({ storage });

module.exports = upload;