// Express
var express = require('express');
var router = express.Router();

// Errors
const createError = require('http-errors');

// MongoDB
const mongo = require('../bin/mongo');
const ObjectId = require('mongodb').ObjectId;

// Other
const defaultAvatar = "https://cdn2.vectorstock.com/i/thumb-large/20/76/man-avatar-profile-vector-21372076.jpg";

/**
 * Voir un contact:
 * @param id [string] ObjectId
 */

router.get('/:id', (req, res, next) => {
  mongo.getInstance()
    .collection('contacts')
    .findOne({_id: ObjectId(req.params.id)}, (err, contact) => {
      if (err) throw err;
      if (!contact || !contact._id) return next(createError(404));
      res.render('read.twig', {contact});
    });
});

/**
 * Voir tous les contacts
 */
router.get('/', (req, res, next) => {
  let query = {archive: {$ne: true}};

  mongo.getInstance().collection('contacts').countDocuments(query, (err, nbResults) => {
    if (err) throw err;
    if (!nbResults || nbResults === 0) return next(createError(404));

    mongo.getInstance()
      .collection('contacts')
      .find(query).sort({lastname: 1, firstname: 1}).toArray((err, contacts) => {
      if (err) throw err;
      if (!contacts || contacts.length === 0) return next(createError(404));

      let result = [];
      for (let i in contacts) {
        res.render('contact.twig', {contact: contacts[i]}, (err, html) => {
          result.push(html);
        });
      }

      console.log(result)
      
      res.send({ok: true, nbResults, result});
    });
  });
});

/**
 * Créer un contact
 */
router.post('/', (req, res, next) => {
  if(!req.body || !req.body.lastname) next(createError(401));

  let datas = {
    avatar: req.body.avatar || defaultAvatar,
    firstname: req.body.firstname || '',
    lastname: req.body.lastname,
    description: req.body.description || '',
    phones: req.body.phones || [],
    emails: req.body.emails || [],
    lastUpdate: new Date(),
    createdAt: new Date()
  };

  mongo.getInstance().collection('contacts').insertOne(datas, (err, result) => {
    if (err) throw err;
    if (!result.insertedId) return next(createError(402));

    return res.send({ok: true});
  })
});

/**
 * Mettre à jour un contact
 * @param id [string] ObjectId
 */
router.put('/:id', (req, res, next) => {
  let datas = {};
  let properties = ['avatar', 'firstname', 'lastname', 'description', 'phones', 'emails'];

  for (let i in properties) {
    if (req.body[properties[i]]) datas[properties[i]] = req.body[properties[i]];
  }

  if (Object.keys(datas).length >= 1) {
    datas.lastUpdate = new Date();

    mongo.getInstance()
      .collection('contacts')
      .updateOne({_id: ObjectId(req.params.id)}, {$set: datas}, (err, result) => {
        if (err) throw err;
        if (!result.modifiedCount) return next(createError(401));

        res.send({ok: true, result})
      }
    )
  }
});

/**
 * Supprimer un contact
 * @param id [string] ObjectId
 */
router.delete('/:id', (req, res, next) => {
  mongo.getInstance()
    .collection('contacts')
    .updateOne({_id: ObjectId(req.params.id)}, {$set: {archive: true}}, (err, result) => {
      if (err) throw err;
      if(!result.modifiedCount) return next(createError(401));

      res.send({ok: true})
    });
});

module.exports = router;
