const express = require("express");
const router = express.Router();
const user = require("../models/user");
const url = require("url");
const bcrypt = require("bcrypt");
const tools = require("../tools/tools");
const { check, validationResult } = require("express-validator");



//////////////////////////////rendering ui and check if he has session to redirect him to dashboard//////////////////////////////
router.get("/registerPage", tools.checkSession, function (req, res) {
  res.render("Registration", { msg: req.query.msg, warning: 0 });
});

//////////////////////////////validating and registering user//////////////////////////////
router.post(
  "/register",
  [
    check("userName", "UserName Must Be More Than 3 Characters.").isLength({
      min: 3,
    }),
    check(
      "passWord",
      "Password Must Include At Least A Number, Uppercase And Lowercase And Length Should Be At Least 8"
    ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i"),
    check("passWord2", "Passwords do not match").custom(
      (value, { req }) => value === req.body.passWord
    ),
    check("email", "Email Is Not Valid").isEmail(),
    check("phone", "Please Enter Correct Phone Number").isMobilePhone(),
  ],

  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const alert = errors.array();

      return res.render("Registration", {
        msg: req.query.msg,
        alert,
        warning: 1,
      });
    }

    if (!req.body.userName || !req.body.passWord || !req.body.email) {
      return res.redirect(
        url.format({
          pathname: "/auth/registerPage",
          query: {
            msg: "Empty Field :(",
          },
        })
      );
    }

    user.findOne(
      {
        $or: [
          { userName: req.body.userName.trim() },
          { email: req.body.email },
          { phone: req.body.phone },
        ],
      },
      (err, existUser) => {
        if (err) {
          return res.redirect(
            url.format({
              pathname: "/auth/registerPage",
              query: {
                msg: "Server Error :(",
              },
            })
          );
        }

        if (existUser) {
          return res.redirect(
            url.format({
              pathname: "/auth/registerPage",
              query: {
                msg: "User Already Exist :(",
              },
            })
          );
        }

        new user({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.userName.trim(),
          passWord: req.body.passWord,
          email: req.body.email,
          gender: req.body.gender,
          phone: req.body.phone,
        }).save((err) => {
          if (err) {
            return res.redirect(
              url.format({
                pathname: "/auth/registerPage",
                query: {
                  msg: "Server Error :(",
                },
              })
            );
          }

          return res.redirect("/auth/loginPage");
        });
      }
    );
  }
);

//////////////////////////////rendering login page//////////////////////////////
router.get("/loginPage", tools.checkSession, (req, res) => {
  res.render("Login", { msg: req.query.msg, warning: 0 });
});

//////////////////////////////checking informations of login//////////////////////////////
router.post("/login", (req, res) => {
  //checking if it is null or not
  if (!req.body.userName || !req.body.passWord) {
    return res.redirect(
      url.format({
        pathname: "/auth/loginPage",
        query: {
          msg: "Empty Field :(",
        },
      })
    );
  }

  //checking for same username
  user.findOne({ userName: req.body.userName.trim() }, (err, User) => {
    if (err) {
      return res.redirect(
        url.format({
          pathname: "/auth/loginPage",
          query: {
            msg: "Server Error :(",
          },
        })
      );
    }

    //checking if password is correct
    if (!User) {
      return res.redirect(
        url.format({
          pathname: "/auth/loginPage",
          query: {
            msg: "User Not Found :(",
          },
        })
      );
    }

    bcrypt.compare(req.body.passWord, User.passWord, (err, isMatch) => {
      if (err) {
        return res.redirect(
          url.format({
            pathname: "/auth/loginPage",
            query: {
              msg: "Server Error :(",
            },
          })
        );
      }

      if (!isMatch) {
        return res.redirect(
          url.format({
            pathname: "/auth/loginPage",
            query: {
              msg: "User Not Found :(",
            },
          })
        );
      }

      //setting  our session
      req.session.User = User;

      return res.redirect("/user/dashboard");
    });
  });
});

//////////////////////////////Forget Password//////////////////////////////
router.post("/forget", (req, res) => {


  user.findOne({ email: req.body.email }, (err, User) => {

    if (err || User === null) {
      return res.redirect(
        url.format({
          pathname: "/auth/loginPage",
          query: {
            msg: "Email is Incorrect",
          },
        })
      );
    }
  
    const send = require("gmail-send")({
      user: "karimiusef679@gmail.com",
      pass: "unknown1679",
      to: `${User.email}`,
      subject: "Resetting Password",
    });
    

    send(
      {
        text: `Your New Password Is ${User.phone}`,
      },
      (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result);
        return res.redirect(
          url.format({
            pathname: "/auth/loginPage",
            query: {
              msg: "Enter The Password That Was Sent To Your Email",
            },
          })
        );
      }
    );

    user.findOneAndUpdate(
      { _id: User.id },
      { passWord: User.phone},
      { new: true },
      (err, password) => {

        if (err) {
          return res.redirect(
            url.format({
              pathname: "/auth/loginPage",
              query: {
                msg: "Server Error",
              },
            })
          );
        }

        password.save();
      }
    );
  });
});

module.exports = router;
