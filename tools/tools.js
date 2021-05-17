const url = require("url");
const tools = {};


//cehcking session
tools.checkSession = function (req, res, next) {
  if (req.cookies.user_sid && req.session.User) {
    return res.redirect("/user/dashboard");
  }

  return next();
};


//checking if client is logged in
tools.checkLogin = function (req, res, next) {
  if (!req.session.User) {
    return res.redirect(
      url.format({
        pathname: "/auth/loginPage",
        query: {
          msg: "Please Login First!!!",
        },
      })
    );
  }

  return next();
};


//checking if adm,in sending request or no
tools.checkAdmin = function (req, res, next) {
  if (!req.session.User || req.session.User.role != "admin") {
    return res.redirect(
      url.format({
        pathname: "/",
      })
    );
  }
  return next();
};
module.exports = tools;
