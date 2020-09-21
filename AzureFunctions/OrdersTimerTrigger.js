const mongodb = require('mongodb');

// TODO: Replace the uri value with your Cosmos DB primary connection string.
const uri = '<your-cosmos-db-connection-string>';
const database = 'best-for-you-organics';
const collection = 'orders';

module.exports = function (context, myTimer) {
    context.log('Running');
    mongodb.MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (error, client) {
        if (error) {
            context.log('Failed to connect: ', error);
            return context.done();
        }
        context.log('Connected');

        var db = client.db(database);

        let users = null;

        db.collection('users').find().toArray(function (err, items) {
            if (err) {
                context.log.error('Error retrieving user details:', err);
            }
            users = items;
        });

        db.collection(collection).find({ 'processed': false }).toArray(function (err, docs) {
            if (err) {
                context.log('Error running query: ', err);
                return context.done();
            }

            context.log(`Queueing ${docs.length} orders.`);

            var ordersToQueue = [];

            for(var i=0; i < docs.length; i++) {
                var orderId = docs[i]['id'];
                var userId = docs[i]['userId'];
                
                context.log(`Sending order ${orderId} to orderqueue.`);

                let firstName = null;
                for(var j=0; j < users.length; j++) {
                    if (users[j]['email'] === userId) {
                        firstName = users[j]['firstName'];
                    }
                }

                var order = {
                    orderId: orderId,
                    userId: docs[i]['userId'],
                    sendNotification: docs[i]['sendNotification'],
                    firstName: firstName
                };
                context.log(order);
                ordersToQueue.push(order);
                
                db.collection(collection).updateOne( {'id': orderId }, { $set: { 'processed': true }});
                context.log('Updated processed to true for order ID:', orderId);
            }

            context.bindings.outputQueue = ordersToQueue;
            client.close();
            context.done();
        });
    });
};