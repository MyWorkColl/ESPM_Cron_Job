const express = require('express');
const axios = require('axios');
const { Meter, Property, Error } = require('../../db/models');
require('dotenv').config();

const router = express.Router();
router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, BASE_URL, My_DOMAIN } = process.env;
const auth = { username: ESPM_USERNAME, password: ESPM_PW };
const cron = require('node-cron');

const meterReadingCron = () => {
    cron.schedule('0 6 * * *', () => {
		axios
			.all([axios.post(My_DOMAIN + `/api/usage`)])
			.catch((error) => {
				const errorObj = {
					errorMsg: `Usage cron job error: ${error.message}`
				};
				Error.create(errorObj);
			});
		});
}


module.exports = {
	meterReadingCron,
};
