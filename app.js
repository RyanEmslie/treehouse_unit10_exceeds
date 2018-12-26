const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const methodOverride = require('method-override');


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const app = express();

app.use(methodOverride('_method'));
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const homeRoute = require('./routes/index');
const booksRoute = require('./routes/books');
const loansRoute = require('./routes/loans');
const patronsRoute = require('./routes/patrons');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/users', usersRouter);
// app.use('/', indexRouter);
app.use('/', homeRoute);
app.use('/books', booksRoute);
app.use('/loans', loansRoute);
app.use('/patrons', patronsRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
