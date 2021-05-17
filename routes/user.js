const express = require("express");
const router = express.Router();
const user = require("../models/user");
const { check, validationResult } = require("express-validator");
const url = require("url");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const tools = require("../tools/multer");
const upload = tools.single("image");
const multer = require("multer");
const article = require("../models/article");
let list_data = [];

//////////////////////////////rendering Dashboard//////////////////////////////
router.get("/dashboard", (req, res) => {
  article
    .find({}, null, { sort: { createdAt: 1 } })
    .populate("owner", { userName: 1 })
    .exec((err, articles) => {
      if (err) return res.render("Err", { title: "Server Error" });

      if (articles != "") {
        for (let index = 0; index < articles.length; index++) {
          try {
            let data = fs.readFileSync(
              `./public/uploads/Html/${articles[index].text}`,
              "utf8"
            );
            let brief = data.slice(0, 90);

            list_data.push(brief);
          } catch (error) {
            return res.redirect(
              url.format({
                pathname: "/auth/loginPage",
                query: {
                  msg: "Server Error",
                },
              })
            );
          }
        }

        return res.render("dashboard", {
          User: req.session.User,
          articles,
          list_data,
          p: 1,
          msg: req.query.msg,
          warning: 0,
        });
      }
      return res.render("Dashboard", {
        p: -1,
        User: req.session.User,
        msg: req.query.msg,
        warning: 0,
      });
    });
});

//////////////////////////////Rendering Edit Profile Page//////////////////////////////
router.get("/update", (req, res) => {
  res.render("Edit_Profile", {
    User: req.session.User,
    msg: req.query.msg,
    warning: 0,
  });
});
//////////////////////////////Updating except password//////////////////////////////

//validating===>
router.put(
  "/update",
  [
    check("userName", "UserName Must Be More Than 3 Characters.").isLength({
      min: 3,
    }),

    check("email", "Email Is Not Valid").optional().isEmail(),
    check("phone", "Please Enter Correct Phone Number").isMobilePhone(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const alert = errors.array();

      return res.status(400).send(alert[0].msg);
    }

    user.findOneAndUpdate(
      {
        _id: req.body._id,
      },

      {
        userName: req.body.userName,
        email: req.body.email,
        phone: req.body.phone,
      },
      {
        new: true,
      },
      (err, User) => {
        if (err) {
          return res
            .status(400)
            .send(
              "This User Is Already Exists(Same Username Or Email Or Phone Number!)"
            );
        }

        req.session.User = User;

        return res.status(200).send("ok");
      }
    );
  }
);

//////////////////////////////updating passWord//////////////////////////////
router.put(
  "/update/passWord",
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

    bcrypt.compare(
      req.body.oldPassWord,
      req.session.User.passWord,
      (err, isMatch) => {
        if (err) {
          return res.status(400).send("Bad Request");
        }

        if (!isMatch) {
          return res.status(400).send("Old Password Is Not Correct! ");
        }

        user.findOneAndUpdate(
          {
            _id: req.body._id,
          },

          {
            passWord: req.body.passWord,
          },
          {
            new: true,
          },

          (err, User) => {
            if (err) {
              return res.status(500).send("Server Erorr");
            }

            User.save();

            req.session.User = User;

            req.session.destroy((err) => {
              if (err) {
                return res.redirect(
                  url.format({
                    pathname: "/user/update",
                    query: {
                      msg: "Server Error :(",
                    },
                  })
                );
              }
          
              return res.status(200).send("ok");
            });
          }
        );
      }
    );
  }
);

//////////////////////////////deleting Account//////////////////////////////
router.delete("/dashboard/:id", (req, res) => {
  user.deleteOne(
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

//////////////////////////////LogOut//////////////////////////////
router.post("/dashboard", (req, res) => {
  req.session.destroy((err) => {
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

    return res.send("ok");
  });
});
//////////////////////////////deleting photo//////////////////////////////
router.delete("/photo/:id", (req, res) => {
  //deleting file from "uploads" directory
  fs.unlink(path.resolve(`./public/uploads/images/${req.params.id}`), (err) => {
    if (err) console.log(err);
  });

  user.findOneAndUpdate(
    { image: req.params.id },
    { image: "" },
    { new: true },
    (err, User) => {
      if (err) {
        return res.status(500).send("Server Error");
      }

      req.session.User = User;
      return res.send("ok");
    }
  );
});

//////////////////////////////editing photo//////////////////////////////
router.post("/photo/change", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.redirect(
        url.format({
          pathname: "/user/update",
          query: {
            msg: "Your image file should be .png or .jpeg or .jpg",
          },
        })
      );
    } else if (err) {
      return console.log(err);
      // An unknown error occurred when uploading.
    } else {
      if (req.session.User.image != "") {
        //removing old photo if exists
        fs.unlink(
          path.resolve(`./public/uploads/images/${req.session.User.image}`),
          (err) => {
            if (err) console.log(err);
          }
        );
      }
      //removing from database//
      user.findOneAndUpdate(
        {
          _id: req.body._id,
        },

        {
          image: req.file.filename,
        },
        {
          new: true,
        },

        (err, User) => {
          if (err) {
            return res.status(400).send("Bad Request");
          }

          req.session.User = User;

          return res.redirect("/user/dashboard");
        }
      );
    }
  });
});

module.exports = router;
