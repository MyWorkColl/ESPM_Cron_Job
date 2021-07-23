const express = require("express");
// const http = require("http");
const bodyParser = require("body-parser")
const path = require("path");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.SERVER_PORT || 3000;
const app = require('./app')
const db = require("./db");
const cron = require('node-cron')

let dbState = {};

const db_sync = () => {
	db.sequelize
	.sync()
	// .sync({ alter: true })
	.then(msg => {
		console.log("DB connected successfully!");
		dbState.status = true;
	})
	.catch(err => {
		console.log(err.message);
		dbState.status = false;
		dbState.message = err.message;
	});
};

db_sync();

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

// // Schedule tasks to be run on the server.
// cron.schedule('2 * * * * *', function() {
//   console.log('running a task every minute at the 2th second');
// });