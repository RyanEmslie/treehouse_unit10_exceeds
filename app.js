const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const methodOverride = require("method-override");


//Routes
const homeRoute = require("./routes");
const booksRoute = require("./routes/books");
const loansRoute = require("./routes/loans");
const patronsRoute = require("./routes/patrons");



const app = express();

//After research I found the moverride to help with the express PUT calls
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


app.use("/", homeRoute);
app.use("/books", booksRoute);
app.use("/loans", loansRoute);
app.use("/patrons", patronsRoute);




// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });


// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });



// // app.use(function(req, res, next) {
// //   return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
// // });

// app.use(function(req, res, next){
//   res.status(404).render('error', {title: "Sorry, page not found"});
// });

// Handle 404

app.use(function(error, req, res, next) {
  res.status(500);
  res.render('500.pug', {title:'500: Internal Server Error', error: error});
});


app.use(function(req, res) {
  res.status(400);
 res.render('404.pug', {title: '404: File Not Found'});
});
module.exports = app;
