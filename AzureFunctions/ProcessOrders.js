module.exports = function (context, orderToProcess) {
	// Do order processing stuff...
	context.log(`Processing order number ${orderToProcess.orderId}.`);

	// Send notification that order processing is complete to customer.
	if (orderToProcess.sendNotification)  {
        var order = {
            orderId: orderToProcess.orderId,
            userId: orderToProcess.userId,
            notificationEmail: orderToProcess.userId,
            firstName: orderToProcess.firstName
        };

        context.bindings.outputQueue = order;
        context.log('Sent to notificationqueue for order id ', orderToProcess.orderId);
	}
	else {
		context.log('Notification not requested, not sent to notificationqueue for order id ', orderToProcess.orderId);
	}
	
    context.done();
}