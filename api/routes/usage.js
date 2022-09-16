const express = require('express');
const router = express.Router();
const moment = require('moment');
const axios = require('axios');
const parser = require('xml2json');

const { Usage} = require('../../db/models');
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

	const options = {
		object: true,
	};

	const endDate = moment().format('YYYY-MM-DD');
	const startDate = moment().subtract(3, 'months').format('YYYY-MM-DD');
	
	console.log(`duration from ${startDate} to ${endDate}`)

	// let meterReading = [];
	try {
		// Handle 'Get Associated Property Meters' api response
		const response = await axios.get(
			My_DOMAIN + `/api/meter`
		);
		
		const data = response.data;
		
		let meterIdArray = data.map((item) => item.id);

		console.log(`meter id list is ---->${meterIdArray}`)

		// Handle 'Get Meter Consumption Data' API call
		let usages = data.map(item => {
			let meterId = item.id;
			let PropertyId = item.PropertyId;

			return axios
				.get(
					BASE_URL +
						`/meter/${meterId}/consumptionData?page=1&startDate=${startDate}&endDate=${endDate}`,
					config
				)
				.then((response) => parser.toJson(response.data, options))
				.then(data => {

					if (
						typeof data.meterData === 'undefined' ||
						typeof data.meterData.meterConsumption == 'undefined'
					) {
						console.log(`no usage data for ${meterId}`);
					} else {
						let { meterConsumption } = data.meterData;
						
						meterConsumption = Array.isArray(meterConsumption)
							? meterConsumption
							: [meterConsumption];
						// return { meterId, meterConsumption };
						return meterConsumption.map(meterUsage => {
							let { id, estimatedValue, cost, startDate, endDate, usage } =
								meterUsage;

							let meterReadingObj = {
								id,
								estimatedValue,
								cost,
								startDate,
								endDate,
								usage,
								MeterId: meterId,
								PropertyId,
							};

							// console.log(meterReadingObj);
							Usage.updateOrCreate(meterReadingObj);
							return meterReadingObj;
						})
					}
				})
		})

		let results = await Promise.all(usages);
		let filteredResults = results.filter(item => !!(item)).reduce((accum, curVal) => accum.concat(curVal));

		filteredResults.forEach(reading => Usage.updateOrCreate(reading));
		console.log(filteredResults.length)
		// Usage.bulkCreate(filteredResults);
		res.send(filteredResults);
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