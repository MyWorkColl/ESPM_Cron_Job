const express = require("express");
// const http = require("http");
const bodyParser = require("body-parser")
const path = require("path");
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.SERVER_PORT || 3000;
const app = require('./app')
const db = require("./db");
const cron = require('node-cron');
const https = require('https');
const fs = require("fs");

const { meterCron } = require('./api/cronjob/meterCron');
const { meterReadingCron } = require('./api/cronjob/meterReadingCron');
const startUpCallback = () => console.log(`listening on port ${PORT}`)

console.log(process.env.NODE_ENV);

db.sync()
	.then(() => {
		if (process.env.NODE_ENV == "development") {
			app.listen(PORT, startUpCallback);
		} else {

			const options = {
			key: fs.readFileSync('server.key'),
			cert: fs.readFileSync('server.cert'),
			};
			
			https.createServer(
				options,
				app
			)
			.listen(PORT, startUpCallback);
		}
})
	
/**
 * Cron Job
 */
// meterCron();
// meterReadingCron();
	

// app.listen(PORT, () => {
//   console.log(`Example app listening at http://localhost:${PORT}`)
// })

