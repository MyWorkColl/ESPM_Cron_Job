const express = require('express');
const router = express.Router();
const moment = require('moment');
const axios = require('axios');
const parser = require('xml2json');

const { Usage, Error } = require('../../db/models');
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
			'Retry-After': '3600'
		},
		auth,
	};

	const options = {
		object: true,
	};

	// const startDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
	// const endDate = moment().format('YYYY-MM-DD');
	const startDate = '2019-01-01';
	const endDate = '2019-12-31';

	try {
		// Handle 'Get Associated Property Meters' api response
		const response = await axios.get(
			My_DOMAIN + `/api/meter`
		);
		
		const { data } = response;
		
		let meterIdArray = data.map((item) => item.id);

		// console.log(`meter id list is ---->${meterIdArray.length}`)
			
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
						// const errorObj = {
						// 	errorMsg: 'Empty Data - No usage data found',
						// 	meter_id: meterId,
						// 	property_id: PropertyId,
						// };
						// Error.create(errorObj);

						return {};
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

							Usage.updateOrCreate(meterReadingObj);
							return meterReadingObj;
						})
					}
				}).catch(error => {
					const errorMsg = error.message;

					if (errorMsg !== 'Request failed with status code 404') {
						const errorObj = {
							errorMsg,
							meter_id: meterId,
							property_id: PropertyId,
						};
						Error.create(errorObj);
					}
					
					return {};
				})
			
		})

		let results = await Promise.all(usages);
		res.send(results);

	} catch (error) {
		console.log(`${error.message}`);
	}
});

router.get('/', (req, res, next) => {
	Usage.findAll()
		.then((usage) => res.send(usage))
		.catch(next);
});

module.exports = router;