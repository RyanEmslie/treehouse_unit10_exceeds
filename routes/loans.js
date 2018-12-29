("use strict");

const express = require("express");
const router = express.Router();
const moment = require("moment");
const Books = require("../models").Books;
const Loans = require("../models").Loans;
const Patrons = require("../models").Patrons;

// -**********************
// GET loans page
// -**********************

router.get("/", function(req, res, next) {
  Loans.findAll({
    include: [{ all: true }],
    order: "book_id"
  })
    .then(function(loanData) {
      res.render("loans", {
        title: "Loans",
        loans: loanData
      });
    })
    .catch(function(err) {
      res.status(500);
    });
});

// -**********************
// GET overdue loans
// -**********************
router.get("/overdue", function(req, res, next) {
  Loans.findAll({
    include: [{ all: true }],
    where: { return_by: { $lt: new Date() }, returned_on: null }
  })
    .then(function(loanData) {
      res.render("overdueloans", {
        title: "Overdue Loans",
        loans: loanData
      });
    })
    .catch(function(err) {
      res.status(500);
    });
});

// -**********************
// GET checked-out loans
// -**********************
router.get("/checked_out", function(req, res, next) {
  Loans.findAll({
    include: [{ all: true }],
    where: { returned_on: null }
  })
    .then(function(loanData) {
      res.render("checkedoutloans", {
        title: "Checked-Out Loans",
        loans: loanData
      });
    })
    .catch(function(err) {
      res.status(500);
    });
});

// -**********************
// GET new loan form
//I had trouble advancing newDate() +7 days.  Researched and installed 'moment' package for ease
// -**********************

router.get("/new", function(req, res, next) {
  Books.findAll().then(function(books) {
    Patrons.findAll()
      .then(function(patrons) {
        let loanedOn = moment().format("YYYY-MM-DD");
        let returnBy = moment()
          .add("7", "days")
          .format("YYYY-MM-DD");
        res.render("newloan", {
          books: books,
          patrons: patrons,
          loaned_on: loanedOn,
          return_by: returnBy
        });
      })
      .catch(function(err) {
        res.sendStatus(500);
      });
  });
});

// -**********************
// POST loans  - Create New Loan
// -**********************
//This function is post request is too verbose and could use some work
router.post("/new", function(req, res, next) {
  Loans.create(req.body)
    .then(function(loan) {
      res.redirect("/loans");})
    .catch(function(err) {
      if (err.name == "SequelizeValidationError") {
        let bookdetails;
        let patrondetails;
        Books.findAll({ attributes: ["id", "title"], order: "title" })
          .then(function(results) {
            bookdetails = results;
          })
          .then(
            Patrons.findAll({
              attributes: ["id", "first_name", "last_name"],
              order: "last_name"
            })
              .then(function(results) {
                patrondetails = results;
              })
              .then(function() {
                res.render("newloan", {
                  title: "Create New Loan",
                  books: bookdetails,
                  patrons: patrondetails,
                  loaned_on: moment().format("YYYY-MM-DD"),
                  return_by: moment()
                    .add(7, "days")
                    .format("YYYY-MM-DD"),
                  errors: err.errors
                });
              }) // ends then
          ); // ends then
      } else {
        throw err
      }
    })
    .catch(function(err) {
      res.sendStatus(500);
    });
}); // ends POST


// -**********************
// Get return book form and details via loan id
// -**********************
router.get("/return/:id", function(req, res, next) {
  Loans.findById(req.params.id, {
    include: [{ all: true }]  })
    .then(function(loanData) {
        loanData.returned_on = moment().format("YYYY-MM-DD");
        res.render("returnbook", {
          title: "Return Book",
          loan: loanData
        });
    })
    .catch(function(err) {
      res.sendStatus(500);
    });
});

// -**********************
// PUT or update return book using loan id
// -**********************
router.put("/return/:id", function(req, res, next) {
  Loans.findById(req.params.id)
    .then(function(loan) {
      return loan.update(req.body);
    })
    .then(function() {
      res.redirect("/loans");
    })
    .catch(function(err) {
      if (err.name == "SequelizeValidationError") {
        Loans.findById(req.params.id, {
          include: [{ all: true }]
        }).then(function(loanData) {
          loanData.returned_on = moment().format("YYYY-MM-DD");
          res.render("returnbook", {
            title: "Return Book",
            loan: loanData,
            errors: err.errors
          });
        });
      } else {
        throw err;
      }
    }) // ends catch
    .catch(function(err) {
      res.sendStatus(500);
    })
});

module.exports = router;
