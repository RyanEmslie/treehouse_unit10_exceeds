'use strict'

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");

// Routes
const homeRoute = require("./routes");
const booksRoute = require("./routes/books");
const loansRoute = require("./routes/loans");
const patronsRoute = require("./routes/patrons");

const app = express();

// After research I found the methodOverride to help with the express PUT calls
// Need to do more research
app.use(methodOverride("_method"));
app.set("port", process.env.PORT || 3000);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Gets rid of the annoying 400 error for favicon - DEVELOPMENT
app.get('/favicon.ico', (req, res) => res.status(204));

// Routes
app.use("/", homeRoute);
app.use("/books", booksRoute);
app.use("/loans", loansRoute);
app.use("/patrons", patronsRoute);

// ERROR HANDLER - 400
app.use(function(req, res) {
  res.status(400);
  res.render('404.pug', {title: '404: File Not Found'});
});

// ERROR HANDLER - 505
app.use(function(error, req, res, next) {
  res.sendStatus(500);
  console.log('500!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  res.render('500.pug', {title:'500: Internal Server Error', error: error});
});

module.exports = app;
