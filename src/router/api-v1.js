'use strict';

const express = require('express');

const getModel = require('../middleware/params');
const router = express.Router();
router.param('model', getModel);

const bearer = require('../middleware/bearer-auth');
const permissions = require('../middleware/auth-capabilities');

router.post('/:model', postHandler);
router.get('/:model', getHandler);
router.get('/:model/:id', getHandlerById);
router.put('/:model/:id',  bearer, permissions('update'), updateHandler);
router.patch('/:model/:id',  bearer, permissions('update'), patchHandler);
router.delete('/:model/:id', bearer, permissions('delete'), deleteHandler);


function postHandler(req, res, next) {
  req.model.create(req.body)
    .then(record => {
      res.status(201).json(record);
    }).catch(next);
}

function getHandler(req, res, next) {
  req.model.read()
    .then(record => {
      res.status(200).json({
        count: record.length,
        result: record,
      });
    }).catch(next);
}

function getHandlerById(req, res, next) {
  req.model.read({_id: req.params.id})
    .then(record => {
      res.status(200).json(record);
    }).catch(next);
}

function updateHandler(req, res, next) {
  req.model.update(req.params.id, req.body)
    .then(record => {
      res.status(201).json(record);
    }).catch(next);
}

function patchHandler(req, res, next) {
    req.model.patch(req.params.id, req.body)
      .then(record => {
        res.status(201).json(record);
      }).catch(next);
}

function deleteHandler(req, res, next) {
  req.model.delete(req.params.id)
    .then(record => {
      res.status(200).json('the deletion  done');
    }).catch(next);
}

module.exports = router;
