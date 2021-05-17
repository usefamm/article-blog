const express = require("express");
const router = express.Router();
const auth = require("./auth");
const user = require("./user");
const tools = require("../tools/tools");
const admin=require('./admin')
const article = require("./article");
const comment=require('./comment')

router.use("/auth", auth);
router.use("/admin", tools.checkAdmin,admin);
router.use("/article", tools.checkLogin, article);
router.use("/user", tools.checkLogin, user);
router.use("/comment", tools.checkLogin, comment);

router.get("/", (req, res) => {
  res.render("home");
});
module.exports = router;
