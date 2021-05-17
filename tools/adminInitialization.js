const user = require("../models/user");
const fs = require("fs");
const path = require("path");
let imageDir = path.join(__dirname, "../public/uploads/images");
let htmlDir = path.join(__dirname, "../public/uploads/Html");
let uploadDir = path.join(__dirname, "../public/uploads");
//creating admin and folders//
let admin = (function () {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("Uploads Created");
  }



  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
    console.log("Uploads images Created");
  }
  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir);
    console.log("Uploads Html Created");
  }
  user.findOne({ role: "admin" }, (err, admin) => {
    if (err) return console.log(err);

    if (admin) return console.log("admin exist!");

    new user({
      firstName: "Usef",
      lastName: "Karimi",
      userName: "Usef_yk",
      passWord: "Unknown1679",
      email: "usefamm2@gmail.com",
      gender: "male",
      phone: "+989193137193",
      role: "admin",
    }).save((err) => {
      if (err) {
        return console.log("admin creation fail...");
      }

      return console.log("admin created successfully");
    });
  });
})();

module.exports = admin;
