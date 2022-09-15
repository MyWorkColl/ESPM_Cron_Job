const express = require('express');
const axios = require('axios');
const { Meter, Property } = require('../../db/models');
require('dotenv').config();

const router = express.Router();
router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, BASE_URL, My_DOMAIN } = process.env;
const auth = { username: ESPM_USERNAME, password: ESPM_PW };
const cron = require('node-cron');
const { models } = require('../../db');

const config = {
	headers: {
		'content-type': 'application/xml',
	},
	auth,
};

const meterReadingCron = () => {
    // Running the cron job every 2 mins
    cron.schedule('*/2 * * * *', () => {
    // Running the cron job on the 1st day of each month
    // cron.schedule('* * 1 1-12 *', () => {
        axios.all([
                    axios.post(My_DOMAIN + `/api/property`),
                    axios.post(My_DOMAIN + `/api/meter`),
                    axios.post(My_DOMAIN + `/api/usage`),
                ])
                .then(
                    axios.spread((firstRes, secondRes, thirdRes) => {
                        console.log(firstRes, secondRes, thirdRes);
                    })
                )
                .catch((error) => console.log(`cron joberror ${error}`));
    });
}


module.exports = {
	meterReadingCron,
};
