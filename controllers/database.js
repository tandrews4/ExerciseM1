var mongodb = require('mongodb'); // import mongo driver
var mongoDBURI = 'mongodb://cs3520:cs3520@ds044689.mlab.com:44689/project2'; // mongo url

// Exercise M1 test method
module.exports.getAllOrders = function(req, res) {
    mongodb.MongoClient.connect(mongoDBURI, function(err, client) {
        if (err)
            throw err;

        var db = client.db('project2')
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

// Our exported storeData function to store the order data into mongo
module.exports.storeData = function(req, res) {
    mongodb.MongoClient.connect(mongoDBURI, function(err, client) { // Try to connect to mLab
        if (err) {
            doError(err, res, client);
            return;
        }

        var db = client.db('project2'); // project2 is our mLab database

        // Generate unique IDs for the different mongo collections we will create document in
        var customerID = Math.floor((Math.random() * 1000000000000) + 1);
        var billingID = Math.floor((Math.random() * 1000000000000) + 1);
        var shippingID = Math.floor((Math.random() * 1000000000000) + 1);
        var orderID = Math.floor((Math.random() * 1000000000000) + 1);

        // Parse JSON order body and make object
        var order = JSON.parse(req.body.order);

        // Get customers collection and create document
        var customers = db.collection('CUSTOMERS');
        var customerdata = {
            _id: customerID,
            FIRSTNAME: order.userinfo.billinfo.billfirstname,
            LASTNAME: order.userinfo.billinfo.billlastname,
            STREET: order.userinfo.billinfo.billaddress1 + ' ' + order.userinfo.billinfo.billaddress2,
            CITY: order.userinfo.billinfo.billcity,
            STATE: order.userinfo.billinfo.billstate,
            ZIP: order.userinfo.billinfo.billzip,
            EMAIL: order.userinfo.billinfo.billemail,
            PHONE: order.userinfo.billinfo.billphone
        };

        // Get billing collection and create document
        var billing = db.collection('BILLING');
        var billingdata = {
            _id: billingID,
            CUSTOMER_ID: customerID,
            CREDITCARDTYPE: order.paymentinfo.cardtype,
            CREDITCARDNUM: order.paymentinfo.cardnumber,
            CREDITCARDEXP: order.paymentinfo.cardexpmonth + "/" + order.paymentinfo.cardexpyear,
            CREDITCARDSECURITYNUM: order.paymentinfo.cardcvv
        }

        // Get shipping collection and create document
        var shipping = db.collection('SHIPPING');
        var shippingdata = {
            _id: shippingID,
            CUSTOMER_ID: customerID,
            SHIPPING_STREET: order.userinfo.shipinfo.shipaddress1 + ' ' + order.userinfo.shipinfo.shipaddress2,
            SHIPPING_CITY: order.userinfo.shipinfo.shipcity,
            SHIPPING_STATE: order.userinfo.shipinfo.shipstate,
            SHIPPING_ZIP: order.userinfo.shipinfo.shipzip
        }

        // Get orders collection and create document
        var orders = db.collection('ORDERS');
        var orderdata = {
            _id: orderID,
            CUSTOMER_ID: customerID,
            BILLING_ID: billingID,
            SHIPPING_ID: shippingID,
            DATE: order.basket.date,
            PRODUCT_VECTOR: order.basket.order_vector,
            ORDER_TOTAL: order.basket.total
        }

        // Chain our document insertion into mongo in proper order
        customers.insertOne(customerdata, function (err) {
            if (err) {
                doError(err, res, client);
                return;
            }

            billing.insertOne(billingdata, function (err) {
                if (err) {
                    doError(err, res, client);
                    return;
                }

                shipping.insertOne(shippingdata, function (err) {
                    if (err) {
                        doError(err, res, client);
                        return;
                    }

                    orders.insertOne(orderdata, function (err) {
                        if (err) {
                            doError(err, res, client);
                            return;
                        }

                        res.render('storeData', {ordernumber: orderID}); // Create our response message after all data successfully inserted
                        doClose(client); // Close the mongo connection when done
                    });
                });
            });
        });
    });
}

// Handle mongo errors and create proper response message then close connection
function doError(err, res, client) {
    res.status(500);
    res.render('storeData', {err: err});

    doClose(client);
}

// Close a mongo connection
function doClose(client) {
    client.close(function (err) {
        if (err) {
            throw err;
        }
    });
}