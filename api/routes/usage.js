const express = require('express');
const router = express.Router();
const moment = require('moment');
const axios = require('axios');

const { Usage, Meter } = require('../../db/models');
require('dotenv').config();

router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, BASE_URL, My_DOMAIN } = process.env;
const auth = { username: ESPM_USERNAME, password: ESPM_PW };

// Test xml parse
const parseString = require('xml2js').parseString;

// ESPM get request : /meter/(meterId)/consumptionData?page=(page)&startDate=(YYYY-MM-DD)&endDate=(YYYY-MM-DD)
router.post('/', async (req, res, next) => {
	const config = {
		headers: {
			'content-type': 'application/xml',
		},
		auth,
	};

	const endDate = moment().format('YYYY-MM-DD');
	const startDate = moment().subtract(3, 'months').format('YYYY-MM-DD');
	
	console.log(`duration from ${startDate} to ${endDate}`)

	try {
		// Handle 'Get Associated Property Meters' api response
		const response = await axios.get(
			My_DOMAIN + `/api/meter`
		);

		const data = response.data;
		let meterDataObj = {};
		data.map((item) => (meterDataObj[item.id] = item.PropertyId));
		const meterIdArray = Object.keys(meterDataObj);

		// Handle 'Get Meter Consumption Data' API call
		meterIdArray.forEach(async (meterId) => {
			const response = await axios.get(
				BASE_URL +
					`/meter/${meterId}/consumptionData?page=1&startDate=${startDate}&endDate=${endDate}`,
				config
			);
			const xml2 = response.data;
			let meterReading = [];

			parseString(xml2, async function (err, result) {
				if (err) {
					throw err;
				}

				json_res = JSON.stringify(result, null, 2);
				json_obj = JSON.parse(json_res);
				json_obj = json_obj.meterData;
				obj_keys = Object.keys(json_obj);

				if (obj_keys.includes('meterConsumption')) {
					json_obj = json_obj.meterConsumption;

					json_obj.forEach((reading) => {
						let { id, cost, startDate, endDate, usage } = reading;

						meterReading_obj = {
							id: id.toString(),
							estimatedValue: reading['$'].estimatedValue,
							cost: cost ? cost.toString() : '',
							startDate: startDate ? startDate.toString() : '',
							endDate: endDate ? endDate.toString() : '',
							usage: usage ? usage.toString() : '',
							MeterId: meterId.toString(),
							PropertyId: meterDataObj[meterId].toString(),
						};

						// Usage.updateOrCreate(meterReading_obj);
						meterReading.push(meterReading_obj);
					});

					try {
						await Usage.bulkCreate(meterReading);
					} catch (err) {
						console.log(`bulk-create error for meter # ${meterId} ---> ${err}`);
					}
				} else {
					console.log(`No data for ${meterId} ----> ${meterDataObj[meterId]}`);
				}
			});
		});
		res.status(400).send('Property  created or updated.');
	} catch (error) {
		console.log(error);
	}
});

router.get('/', (req, res, next) => {
	Usage.findAll()
		.then((usage) => res.send(usage))
		.catch(next);
});

module.exports = router;