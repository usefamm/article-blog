const express = require("express");
const router = express.Router();
const user = require("../models/user");
const url = require("url");
const fs = require("fs");
const { check, validationResult } = require("express-validator");
const path = require("path");
const article = require("../models/article");
const comment = require("../models/comment");


//////////Showing All Users Info//////////
router.get("/users", (req, res) => {
  user.find({ role: { $ne: "admin" } }, (err, users) => {
    if (err) {
      return res.redirect(
        url.format({
          pathname: "/user/dashboard",
          query: {
            msg: "Server Error :(",
          },
        })
      );
    }

    return res.render("allUSers", { users, User: req.session.User });
  });
});

//////////Changing Passwords//////////
router.put(
  "/",
  [
    check(
      "passWord",
      "Password Must Include At Least A Number, Uppercase And Lowercase And Length Should Be At Least 8"
    ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const alert = errors.array();

      return res.status(400).send(alert[0].msg);
    }

    user.findOneAndUpdate(
      { _id: req.body.id.trim() },
      { passWord: req.body.passWord },
      { new: true },
      (err, User) => {
        if (err) return res.status(500).send("Server Erorr");

        User.save();

        return res.status(200).send("ok");
      }
    );
  }
);

//////////////////////////////Deleting Article//////////////////////////////
router.delete("/article/:id", (req, res) => {
 
  fs.unlink(
    path.resolve(`./public/uploads/Html/${req.body.text.trim()}`),
    (err) => {
      if (err) console.log(err);
    }
  );

  fs.unlink(
    path.resolve(`./public/uploads/images/${req.body.image.trim()}`),
    (err) => {
      if (err) console.log(err);
    }
  );
  comment.deleteMany(
    {
      article: req.params.id,
    },
    (err) => {
      if (err) {
        return res.status(500).send("Server Error");
      }

    }
  );

  article.deleteOne(
    {
      _id: req.params.id,
    },
    (err) => {
      if (err) {
        return res.status(500).send("Server Error");
      }

      return res.status(200).send("ok");
    }
  );
});

//////////////////////////////Deleting Blogger//////////////////////////////
router.delete("/blogger/:id", (req, res) => {
//finding articles and deleting them
  article.find({ owner: req.params.id }, (err, Article) => {

    if (err) return res.status(500).send("Server Error");
//deleting article image and text from our local
    if (Article) {
      for (let index = 0; index < Article.length; index++) {
        fs.unlink(
          path.resolve(`./public/uploads/Html/${Article[index].text}`),
          (err) => {
            if (err) return console.log(err);
          }
        );

        fs.unlink(
          path.resolve(`./public/uploads/images/${Article[index].image}`),
          (err) => {
            if (err) return console.log(err);
          }
        );
      
        //deleting article from database
        article.deleteOne(
          {
            owner: req.params.id,
          },
          (err) => {
            if (err) {
              return console.log("Server Error In Deleting Article");
            }
          }
          );
        }
    }
    //deleting comments
    comment.deleteMany(
      {
        owner: req.params.id,
      },
      (err) => {
        if (err) {
          return res.status(500).send("Server Error");
        }

      }
    );
//deleting blogger
    user.deleteOne(
      {
        _id: req.params.id,
      },
      (err) => {
        if (err) {
          console.log("Server Error In Deleting Blogger");
          return res.status(500).send("Server Erorr");
        }
        return res.status(200).send("ok");
      }
    );
  });
});

//////////////////////////////Deleting Comment//////////////////////////////
router.delete("/comment/:id",(req,res)=>{
  comment.deleteOne(
    {
      _id: req.params.id,
    },
    (err) => {
      if (err) {
        return res.status(500).send("Server Error");
      }

      return res.status(200).send("ok");
    }
  );

})


module.exports=router