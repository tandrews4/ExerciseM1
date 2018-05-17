var mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://TristanA:Logan_22@ds151008.mlab.com:51008/heroku_zsq3qbjc';

module.exports.getAllOrders = function(req, res) {
    mongodb.MongoClient.connect(mongoDBURI, function(err, client) {
        if (err)
            throw err;

        var db = client.db('heroku_zsq3qbjc')
        var orders = db.collection('ORDERS');
        var data = orders.find().toArray(function(err, docs) {
            res.render('getAllOrders', {results: docs});

            client.close(function(err) {
                if (err)
                    throw err;
            });
        });
    });
}