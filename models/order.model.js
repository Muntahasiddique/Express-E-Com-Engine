const db = require('../data/database');
const mongodb = require('mongodb');

class Order {
  constructor(cart, userData, status = 'pending', date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date || new Date()); 
    this.formattedDate = this.date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    this.id = orderId ? orderId.toString() : null;
  }

  // FIXED: Static helper to retrieve a single order by its unique database ID
  static async findById(orderId) {
    const id = new mongodb.ObjectId(orderId);
    const orderDoc = await db.getDb().collection('orders').findOne({ _id: id });
    
    if (!orderDoc) {
      throw new Error('Could not find order with provided ID.');
    }

    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  // FIXED: Static helper to retrieve EVERY order in the database for the Admin view
static async findAll() {
    const orders = await db
      .getDb()
      .collection('orders')
      .find() // <-- I forgot this exact line earlier!
      .sort({ _id: -1 }) 
      .toArray();

    return orders.map(function (orderDoc) {
      return new Order(
        orderDoc.productData,
        orderDoc.userData,
        orderDoc.status,
        orderDoc.date,
        orderDoc._id
      );
    });
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId);
    
    const orders = await db
      .getDb()
      .collection('orders')
      .find({ 'userData._id': uid })
      .sort({ _id: -1 })
      .toArray();

    return orders.map(function (orderDoc) {
      return new Order(
        orderDoc.productData,
        orderDoc.userData,
        orderDoc.status,
        orderDoc.date,
        orderDoc._id
      );
    });
  }

  save() {
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id);
      return db.getDb().collection('orders').updateOne(
        { _id: orderId },
        { $set: { status: this.status } }
      );
    } else {
      const orderDocument = {
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status,
      };

      return db.getDb().collection('orders').insertOne(orderDocument);
    }
  }
}

module.exports = Order;