
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const session=require('express-session')
const api=require('./routes/api');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//connecting to DB
mongoose.connect("mongodb://localhost:27017/weblog", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});


//initializing session
app.use(session({
  key: 'user_sid',
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 1000000
  }
}));
  

//clearing cookie when session is not available
app.use((req,res,next)=>{
 
  if (req.cookies.user_sid && !req.session.User) {
    res.clearCookie('user_sid')
  };
  next();
});



app.use('/', api);



module.exports = app;
