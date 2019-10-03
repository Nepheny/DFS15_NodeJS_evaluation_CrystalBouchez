var express = require('express');
var router = express.Router();

// Errors
const createError = require('http-errors');

// MongoDB
const mongo = require('../bin/mongo');
const ObjectId = require('mongodb').ObjectId;

/**
 * GET home page
 */
router.get('/', (req, res, next) => {
  let query = {archive: {$ne: true}};

  mongo.getInstance().collection('contacts').countDocuments(query, (err, nbResults) => {
    if (err) throw err;
    if (!nbResults || nbResults === 0) return next(createError(404));

    mongo.getInstance()
      .collection('contacts')
      .find(query).sort({createdAt: -1}).limit(3).toArray((err, contacts) => {
      if (err) throw err;
      if (!contacts || contacts.length === 0) return next(createError(404));
      
      res.render( 'index', {title: 'Annuaire', contacts, nbResults});
    });
  });
});


/** 
 * GET from page for update
*/
router.get('/form/update/:id', (req, res, next) => {
  mongo.getInstance()
    .collection('contacts')
    .findOne({_id: ObjectId(req.params.id)}, (err, contact) => {
      if (err) throw err;
      if (!contact || !contact._id) return next(createError(404));
      res.render('form', {contact});
    });
});

/**
 * GET form page for create
 */
router.get('/form/create', (req, res, next) => {
  res.render('form');
});



module.exports = router;
