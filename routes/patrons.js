"use strict";

const express = require("express");
const router = express.Router();
const Books = require("../models").Books;
const Loans = require("../models").Loans;
const Patrons = require("../models").Patrons;

// -**********************
// GET returns all patron records ordered by Last Name
// -**********************
router.get("/", function(req, res, next) {
  Patrons.findAll({
    order: [["last_name", "ASC"]]
  })
    .then(function(patrons) {
      res.render("patrons", { patrons: patrons });
    })
    .catch(function(err) {
      res.sendStatus(500);
    });
});

// -**********************
// GET new patron form
// -**********************
router.get("/new", function(req, res, next) {
  res.render("newpatron", { patrons: Patrons.build() })
  .catch(function(err) {
    res.sendStatus(500);
  });
});

// -**********************
// POST - Create New Patron
// -**********************
router.post("/new", function(req, res, next) {
  Patrons.create(req.body)
    .then(function(patron) {
      res.redirect("/patrons");
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        res.render("newpatron", {
          patron: Patrons.build(req.body),
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(function(err) {
      res.sendStatus(500);
    })
}); 

// -**********************
// GET patron details from ID number
// -**********************
router.get("/:id", function(req, res, next) {
  Patrons.findAll({
    include: [{ model: Loans, include: [{ model: Books }] }],
    where: { id: req.params.id }
  })
    .then(function(patronData) {
        res.render("patrondetail", {
          title: "Patron Details",
          patron: patronData[0],
          loans: patronData[0].Loans
        });
    })
    .catch(function(err) {
      res.sendStatus(500);
    })
});

// -**********************
// PUT - update Patron using patron id
// -**********************
router.put("/:id", function(req, res, next) {
  Patrons.findById(req.params.id)
    .then(function(patron) {
      return patron.update(req.body);
    })
    .then(function(patron) {
      res.redirect("/patrons/" + patron.id);
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        Patrons.findAll({
          include: [{ model: Loans, include: [{ model: Books }] }],
          // include: [{ model: Loans }],
          where: { id: req.params.id }
        })
          .then(function(patronData) {
            if (patronData) {
              res.render("patrondetail", {
                title: "Patron Details",
                patron: patronData[0],
                loans: patronData[0].Loans,
                errors: err.errors
              });
            } else {
              throw err
            }
          })
      }
    })
    .catch(function(err) {
      res.sendStatus(500);
    })
});

module.exports = router;
