'use strict';

const express = require('express');
const router = express.Router();
const Books = require("../models").Books;
const Loans = require("../models").Loans;
const Patrons = require("../models").Patrons;



router.get('/', function(req, res, next) {
    
  Patrons.findAll({
    order: [["last_name", "ASC"]]
  })
  .then(function(patrons) {
    res.render('patrons', {patrons : patrons});
  }).catch(function(err) {
      res.sendStatus(500);
    });

});




// // GET patrons page
// router.get('/', function(req, res, next) {
  //   Patron.findAll({order: 'last_name'}).then(function(patronlistings){
    //     if (patronlistings) {
      //       res.render('partials/patrons', {
//         title: 'Patrons',
//         patrons: patronlistings
//       });
//      } else {
  //         err.status == 404;
  //         return next(err);
  //       }
  //   }).catch(function(err){
//     return next(err);
//   });
// });

// GET new patron form
router.get('/new', function(req, res, next) {
    res.render('newpatron', {
        title: 'Create New Patron'
      });
      if (err) return next(err);
    });
    


// // POST new patron
// router.post('/new', function(req, res, next) {
//   Patron.create(req.body)
//   .then(function(patron){
  //     res.redirect('/patrons/');
  //   }).catch(function(err){
    //     // if there's a validation error, re-render page with errors
    //     if (err.name == 'SequelizeValidationError') {
      
      //       // loop over err messages
//       var errMessages = [];
//       for (var i=0; i<err.errors.length; i++) {
  //         errMessages[i] = err.errors[i].message;
  //       }
  
  //       /* I want to keep existing fields from clearing out on submit (i.e., so that if there's a validation error the librarian doesn't have to re-enter all the data), so I have added logic in the newpatron template to check which properties of req.body exist. I'm making req.body available to the template via the following object */
  //       res.render('partials/newpatron', {
    //         title: 'Create New Patron',
    //         patronFirstName: req.body.first_name,
    //         patronLastName: req.body.last_name,
    //         patronAddress: req.body.address,
    //         patronEmail: req.body.email,
    //         patronLibraryId: req.body.library_id,
    //         patronZipCode: req.body.zip_code,
//         errors: errMessages
//       });
//     } else {
  //       // else send to middleware error handler
  //       return next(err);
  //     }
  //   }); // ends catch
// }); // ends POST


// GET patron details
router.get('/:id', function(req, res, next) {
  Patrons.findAll({
    include: [{ model: Loans, include: [{ model: Books }] }],
    where: { id: req.params.id }
  })
  .then(function(patronData){
    if (patronData) {
      res.render('patrondetail', {
        title: 'Patron Details',
        patron: patronData[0],
        loans: patronData[0].Loans
      });
    } else {
      err.status == 404;
      return next(err);
    }
  }).catch(function(err){
    return next(err);
  });
});


// // PUT or update patron details form
// router.put('/:id', function(req, res, next) {
  //   Patron.findById(req.params.id).then(function(patron){
    //     return patron.update(req.body);
    //   }).then(function(patron){
      //     res.redirect('/patrons/' + patron.id);
      //   }).catch(function(err){
        //     // if there's a validation error, re-render page with errors
        //     if (err.name == 'SequelizeValidationError') {
          
          //       Patron.findAll({
            //         include: [{ model: Loan, include: [{ model: Book }] }],
            //         where: { id: req.params.id }
//       })
//       .then(function(patronlistings){
  //         var patronData = JSON.parse(JSON.stringify(patronlistings));
  //         // loop over err messages
  //         var errMessages = [];
  //         for (var i=0; i<err.errors.length; i++) {
    //           errMessages[i] = err.errors[i].message;
    //         }
    
    //         if (patronData) {
//           res.render('partials/patrondetail', {
  //             title: 'Patron Details',
  //             patron: patronData[0],
//             loans: patronData[0].Loans,
//             errors: errMessages
//           });
//         } // ends if

//       }); // ends then
//     } else {
  //       // else send to middleware error handler
  //       return next(err);
  //     }
  //   }); // ends catch
  // });
  
  module.exports = router;