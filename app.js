require('dotenv').config();
const express = require('express');
const path = require('path');
const ExpressSession = require('express-session');
const csurf = require('csurf');

const createSessionConfig = require('./config/mongodb-session');
const addCsurfMiddleware = require('./middlewares/csurf-token');
const checkAuthMiddleware = require('./middlewares/check-auth');

const errorHandlingMiddleware = require('./middlewares/error-handlingmiddleware');
const ProtectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const db = require('./data/database');

const baseroutes = require('./routes/base.routes');
const authroutes = require('./routes/auth.routes');
const productsroutes = require('./routes/products.routes');
const adminroutes = require('./routes/admin.routes');

const cartRoutes = require('./routes/carts.routes');
const orderRoutes = require('./routes/orders.routes');  
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data/images'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ✅ 1. Setup SESSION middleware before CSRF
const sessionConfig = createSessionConfig();
app.use(ExpressSession(sessionConfig));
app.use(cartMiddleware);
// ✅ 2. Setup CSRF protection AFTER session middleware
//app.use(csurf());
const csrfProtection = csurf({
  value: (req) => req.query._csuf || req.body._csrf  // ✅ Allow both query param & body
});
app.use(csrfProtection);

// ✅ 3. Pass CSRF token to views
app.use(addCsurfMiddleware);
app.use(checkAuthMiddleware);
app.use( '/cart' , cartRoutes);
// ✅ 4. Routes must be AFTER CSRF middleware
app.use(authroutes);
app.use(baseroutes);
app.use(productsroutes);
app.use(ProtectRoutesMiddleware);
app.use(  '/orders' , orderRoutes);
app.use('/admin',adminroutes )

// ✅ 5. Error handling middleware
app.use(errorHandlingMiddleware);

db.connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT || 3001);

  })
  .catch((error) => {
    console.log('Failed to Connect');
    console.log(error);
  });
