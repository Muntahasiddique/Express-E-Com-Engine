const Order = require('../models/order.model');
const User = require('../models/user.model');

async function getOrders(req, res, next) { // Fixed: Added 'next' parameter
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    // Fixed: Changed 'customer' to 'customers' to match your folder
    res.render('customers/orders/all-orders', { 
      orders: orders,
    });
  } catch (error) {
    next(error); 
  }
}

async function addOrder(req, res, next) {
  // Fixed: You MUST define the cart before using it!
  const cart = res.locals.cart; 

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    return next(error);
  }

  // Clear the cart after checkout
  req.session.cart = null; 
  res.redirect('/orders');
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
};