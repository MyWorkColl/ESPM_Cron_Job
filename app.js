require('dotenv').config();
const express = require('express');
// const session = require('express-session');
const path = require('path');
const db = require('./db');


// Routes
const propertyRouter = require('./routes/property');
const meterSubRouter = require('./routes/meters');
const usageSubRouter = require('./routes/usage');

const app = express();

app.use('/assets', express.static(path.join(__dirname, './src/assets')));

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.use('/api/property', propertyRouter);
app.use('/api/meters', meterSubRouter);
app.use('/api/usage', usageSubRouter);

// const routes = {
//   Property: 'property',
//   MeterList: 'meters',
//   Usage: 'usage'
// };

// // Basic routes are auto-generated here
// // For the rest, use subrouters
// Object.keys(routes).forEach(key => {
//   app.get(`/api/${routes[key]}`, (req, res, next) => {
//     db.models[key]
//       .findAll()
//       .then((items) => res.send(items))
//       .catch(next);
//   });
// });

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