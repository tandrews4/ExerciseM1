var express = require('express');
var router = express.Router();

//load controller code dealing with database mongodb and Routes collection
var controllerMongoCollection = require('../controllers/database');

//to process data sent in on request need body-parser module
var bodyParser = require('body-parser');
var path = require('path'); //to work with separtors on any OS including Windows
var querystring = require('querystring'); //for use in GET Query string of form URI/path?name=value

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencode

// Our storeData POST endpoint to save the data from the order
router.post('/storeData', controllerMongoCollection.storeData);

// Our getAllOrders GET endpoint (for testing)
router.get('/getAllOrders', controllerMongoCollection.getAllOrders);

// Our getAllOrders POST endpoint
router.post('/getAllOrders', controllerMongoCollection.getAllOrders);

module.exports = router;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved. 
Licensed under the Apache License, Version 2.0 (the "License"); */