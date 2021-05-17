const express = require("express");
const router = express.Router();
const url = require("url");
const comment = require("../models/comment");
//////////Creating Comment//////////
router.post("/", (req, res) => {
  if(req.body.comment.length>99 || req.body.comment.length<1){
    return res.status(400).send("Bad Request");
  }

  new comment({
    text: req.body.comment,
    owner: req.body.user,
    article: req.body.article
  }).save((err) => {
      
    if (err) {
       
      return res.status(500).send("Server Error");
    }
  });
  return res.sendStatus(200)

});



module.exports = router;
