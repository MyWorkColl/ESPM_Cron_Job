require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db');


// Routes
const authGoogleSubRouter = require('./routes/auth-google');
const brandsSubRouter = require('./routes/brands');
const categoriesSubRouter = require('./routes/categories');
const productsSubRouter = require('./routes/products');
const usersSubRouter = require('./routes/users');
const cartSubRouter = require('./routes/cart');

const app = express();

const { User } = db.models;

app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return next();
  }

  User.findByToken(auth)
    .then((user) => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch(next);
});


const routes = {
  Brand: 'brands',
  Category: 'categories',
  LineItem: 'lineitems',
  Order: 'orders',
  Product: 'products',
  User: 'users',
};

// Basic routes are auto-generated here
// For the rest, use subrouters
Object.keys(routes).forEach((key) => {
  app.get(`/api/${routes[key]}`, (req, res, next) => {
    db.models[key]
      .findAll()
      .then((items) => res.send(items))
      .catch(next);
  });
});

app.use('/auth/google', authGoogleSubRouter);
app.use('/api/brands', brandsSubRouter);
app.use('/api/categories', categoriesSubRouter);
app.use('/api/products', productsSubRouter);
app.use('/api/users', usersSubRouter);
app.use('/api/cart', cartSubRouter);

app.use((err, req, res, next) => {
    let message = "Something's not right";
    
  if (err.errors) {
    message = err.errors[0].message;
  } else if (err.message) {
    message = err.message;
  }

  if (err) {
    res.status(err.status || 500).send({ message });
  }
});

module.exports = app;