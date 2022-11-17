const express = require('express');
const axios = require('axios');
const { Meter, Property, Error } = require('../../db/models');
require('dotenv').config();

const router = express.Router();
router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, BASE_URL, My_DOMAIN } = process.env;
const auth = { username: ESPM_USERNAME, password: ESPM_PW };
const cron = require('node-cron');

const meterCron = () => {
	// Running the cron job every 2 mins
	// cron.schedule('*/2 * * * *', () => {
	// Running the cron job on the 1st day of each month
	// Every Sunday at 23:00 
	cron.schedule('0 6 * * *', () => {
		axios
			.all([
				axios.post(My_DOMAIN + `/api/property`),
				axios.post(My_DOMAIN + `/api/meter`),
				axios.post(My_DOMAIN + `/api/score`),
			])
			.catch((error) => {
				const errorObj = {
					errorMsg: `cron job error: ${error.message}`,
				};
				Error.create(errorObj);
			});
	});
}


module.exports = {
	meterCron,
};
