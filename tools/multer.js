const multer = require("multer");
const path = require("path");

//storage management for file that will be uploaded (multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/images"));
  },
  filename: function (req, file, cb) {
    cb(null, `${req.session.User.userName}-${Date.now()}-${file.originalname}`);
  },
});

// reject a file 
const fileFilter  = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


//management of the storage and the file that will be uploaded
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
