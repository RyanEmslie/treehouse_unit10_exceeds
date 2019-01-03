"use strict";

const express = require("express");
const router = express.Router();
const Books = require("../models").Books;
const Loans = require("../models").Loans;
const Patrons = require("../models").Patrons;


// -***********************
// GET All books page.
// -***********************
router.get("/", function(req, res, next) {
  Books.findAll({
    order: [["author", "ASC"]]
  })
    .then(function(bookData) {
      res.render("books", { books: bookData });
    })
    .catch(function(err) {
      res.status(500);
    });
});

// -***********************
// GET overdue books
//Filter books by retured_on null and (todays date - return_by)
// -***********************
router.get("/overdue", function(req, res, next) {
  Loans.findAll({
    include: [{ model: Books }],
    where: { returned_on: null, return_by: { $lt: new Date() } }
  })
    .then(function(bookData) {
      res.render("overduebooks", {
        title: "Overdue Books",
        loans: bookData
      });
    })
    .catch(function(err) {
      res.send(500);
    });
});

// -***********************
// GET checked-out books
// -***********************
router.get("/checked_out", function(req, res, next) {
  Loans.findAll({
    include: [{ model: Books }],
    where: { returned_on: null },
    order: "title"
  })
    .then(function(bookData) {
      res.render("checkedoutbooks", {
        title: "Checked-Out Books",
        loans: bookData
      });
    })
    .catch(function(err) {
      res.sendStatus(500);
    });
});

// -***********************
//     GET new book form
// -***********************
router.get("/new", function(req, res, next) {
  res
    .render("newbook", {
      title: "Create New Book"
    })
    .catch(function(err) {
      return next(err);
    });
});

// -***********************
// POST - Create New Book
// -***********************
router.post("/new", function(req, res, next) {
  Books.create(req.body)
    .then(function(book) {
      res.redirect("/books");
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        res.render("newbook", {
          book: Books.build(req.body),
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(function(err) {
      return next(err);
    });
});

// -***********************
// GET book details
// -***********************
router.get("/:id", function(req, res, next) {
  Books.findAll({
    include: [{ model: Loans, include: [{ model: Patrons }] }],
    where: { id: req.params.id }
  })
    .then(function(loanData) {
      res.render("bookdetail", {
        title: "Book Details",
        book: loanData[0],
        loans: loanData[0].Loans
      });
    })
    .catch(function(err) {
      res.status(500);
    });
});

// -***********************
// -Put Udate book ID
// -***********************
router.put("/:id", function(req, res, next) {
  Books.findById(req.params.id)
    .then(function(book) {
      return book.update(req.body);
    })
    .then(function(book) {
      res.redirect("/books/" + book.id);
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        Books.findAll({
          include: [{ model: Loans, include: [{ model: Patrons }] }],
          where: { id: req.params.id }
        })
          .then(function(bookData) {
            if (bookData) {
              res.render("bookdetail", {
                title: "Book Details",
                book: bookData[0],
                loans: bookData[0].Loans,
                errors: err.errors
              });
            } else {
              throw err
            }
          })
          .catch(function(err) {
            res.sendStatus(500);
          });
      } 
    });
});


module.exports = router;
