const express = require("express");
const router = express.Router();
const article = require("../models/article");
const multer = require("multer");
const tools = require("../tools/multer");
const upload = tools.single("image");
const url = require("url");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const comment = require("../models/comment");

//////////////////////////////rendering page for creating and watching articles//////////////////////////////
router.get("/", (req, res) => {
  let list_data = [];
  article
    .find({ owner: req.session.User._id })
    .populate("owner", { userName: 1 })
    .exec((err, Article) => {
      if (err) {
        return res.redirect(
          url.format({
            pathname: "/article",
            query: {
              msg: "Server Error",
            },
          })
        );
      }
      ////when we have articles in our database////
      if (Article != "") {
        for (let index = 0; index < Article.length; index++) {
          try {
            let data = fs.readFileSync(
              `./public/uploads/Html/${Article[index].text}`,
              "utf8"
            );
            let brief = data.slice(0, 90);

            list_data.push(brief);
          } catch (error) {
            return res.redirect(
              url.format({
                pathname: "/article",
                query: {
                  msg: "Server Error",
                },
              })
            );
          }
        }

        return res.render("article", {
          Article,
          User: req.session.User,
          list_data,
          p: 1,
          msg: req.query.msg,
          warning: 0,
        });
      }
      ////when we don't have any article  in our database for that user
      return res.render("article", {
        p: -1,
        msg: req.query.msg,
        warning: 0,
        User: req.session.User,
      });
    });
});

//////////////////////////////creating article//////////////////////////////
router.post("/", (req, res) => {
  upload(req, res, function (err) {
    ////multer errors////
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .send("Your image file should be .png or .jpeg or .jpg");
    } else if (err) {
      return console.log(err);
      // An unknown error occurred when uploading.

      ////validating////
    } else if (req.body.title === "" || req.body.text === "") {
      return res.status(400).send("Empty Fields...");
    } else if (req.body.title.length < 2 || req.body.text.length < 100) {
      return res.status(400).send("Title Should Be At Least 2 Letters And Text Should Be At Least 100 ...");
    } else {
      ////creating html file from text that user entered////
      let htmlContent = `<html> <body> ${req.body.text} </body> </html>`;
      let uniqueId = uuidv4();
      fs.appendFile(
        path.resolve(
          `./public/uploads/Html/${req.session.User.userName} - ${uniqueId}.html`
        ),
        htmlContent,
        function (err) {
          if (err) return res.send("Server Error");

          new article({
            title: req.body.title,
            image: req.file.filename,
            text: `${req.session.User.userName} - ${uniqueId}.html`,
            owner: req.session.User._id,
          }).save((err) => {
            if (err) {
              return res.status(500).send("Server Error");
            }
          });

          return res.sendStatus(200);
        }
      );
    }
  });
});

//////////////////////////////rendering more infos page//////////////////////////////
router.get("/:id", (req, res) => {
  let param = req.params.id;
  article.findOne({ _id: param })
    .populate("owner", { userName: 1 })
    .exec((err, article) => {
      if (err) {
        return res.redirect(
          url.format({
            pathname: "/user/dashboard",
            query: {
              msg: "Server Error",
            },
          })
        );
      }

      comment.find({article:param}).populate("owner").exec((err, comment)=>{
        if (err) {
          return res.redirect(
            url.format({
              pathname: "/user/dashboard",
              query: {
                msg: "Server Error",
              },
            })
          );
        }
        
      

      try {
        let data = fs.readFileSync(
          `./public/uploads/Html/${article.text}`,
          "utf8"
        );

        return res.render("moreInfo.ejs", {
          article,
          data,
          comment,
          User: req.session.User,
        });
      } catch (error) {
        return res.redirect(
          url.format({
            pathname: "/user/dashboard",
            query: {
              msg: "Server Error",
            },
          })
        );
      }
    })
    });
});

//////////////////////////////Deleting Article//////////////////////////////
router.delete("/:id", (req, res) => {
  fs.unlink(
    path.resolve(`./public/uploads/Html/${req.body.text.trim()}`),
    (err) => {
      if (err) console.log(err);
    }
  );

  fs.unlink(
    path.resolve(`./public/uploads/images/${req.body.image}`),
    (err) => {
      if (err) console.log(err);
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

//////////////////////////////Rendering Edit Article Page//////////////////////////////
router.get("/edit/:id", (req, res) => {
  article
    .findOne({ _id: req.params.id })
    .populate("owner", { userName: 1 })
    .exec((err, Article) => {
      if (err) {
        return res.redirect(
          url.format({
            pathname: "/article",
            query: {
              msg: "Server Error",
            },
          })
        );
      }
      try {
        let data = fs.readFileSync(
          `./public/uploads/Html/${Article.text}`,
          "utf8"
        );

        return res.render("editArticle", {
          User: req.session.User,
          Article,
          data,
          msg: req.query.msg,
        });
      } catch (error) {
        return res.redirect(
          url.format({
            pathname: "/article",
            query: {
              msg: "Server Error",
            },
          })
        );
      }
    });
});

//////////////////////////////Editing Article PHOTO//////////////////////////////
router.put("/photo", (req, res) => {
  upload(req, res, function (err) {
    ////multer errors////
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .send("Your image file should be .png or .jpeg or .jpg");
    } else if (err) {
      return console.log(err);
      // An unknown error occurred when uploading.

      ////validating////
    } else {
      if (req.body.imageAdr !== "") {
        fs.unlink(
          path.resolve(`./public/uploads/images/${req.body.imageAdr}`),
          (err) => {
            if (err) console.log(err);
          }
        );
      }

      article.findOneAndUpdate(
        {
          text: req.body.name,
        },

        {
          image: req.file.filename,
        },
        {
          new: true,
        },

        (err, Article) => {
          if (err) {
            return res.status(400).send("Bad Request");
          }

          return res.status(200).send("ok");
        }
      );
    }
  });
});

//////////////////////////////updating text and title//////////////////////////////
router.put("/text", (req, res) => {
  if (req.body.title === "" || req.body.text === "") {
    return res.status(400).send("Empty Fields...");
  } else if (req.body.title.length <= 2 || req.body.text.length <= 100) {
    return res.status(400).send("Title Should Be At Least 2 Letters And Text Should Be At Least 100 ...");
  } else {
    let htmlContent = `<html> <body> ${req.body.text} </body> </html>`;

    fs.writeFile(
      path.resolve(`./public/uploads/Html/${req.body.name}`),
      htmlContent,
      (err) => {
        if (err) console.log(err);

        article.findOneAndUpdate(
          { text: req.body.name },
          { title: req.body.title },
          { new: true },
          (err, article) => {
            if (err) {
              return res.status(400).send("Bad Request");
            }

            return res.status(200).send("ok");
          }
        );
      }
    );
  }
});

module.exports = router;
