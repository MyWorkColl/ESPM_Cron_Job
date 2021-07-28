const express = require('express')
const router = express.Router()


const axios = require('axios');
const { Meters } = require('../../db/models');
require('dotenv').config();

router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, ESPM_BASE_URL } = process.env;
const auth = { username: ESPM_USERNAME, password: ESPM_PW };

// Test xml parse
const parseString = require('xml2js').parseString;


// ESPM get request : /meter/(meterId)/consumptionData?page=(page)&startDate=(YYYY-MM-DD)&endDate=(YYYY-MM-DD)
router.get('/', (req, res, next) => {
	try {
		// Handle 'Get Associated Property Meters' api response
		xml =
			'<?xml version="1.0" encoding="UTF-8"?>' +
			'<meterData>' +
			' <meterConsumption estimatedValue="false">' +
			'  <id>-19</id>' +
			'<audit>' +
			'  <createdBy>DUNAYT</createdBy>' +
			'<createdByAccountId>-14</createdByAccountId>' +
			'<createdDate>2012-05-25T09:59:06-04:00</createdDate>' +
			'<lastUpdatedBy>DUNAYT</lastUpdatedBy>' +
			'<lastUpdatedByAccountId>-14</lastUpdatedByAccountId>' +
			'<lastUpdatedDate>2012-05-26T09:59:06-04:00</lastUpdatedDate>' +
			'</audit>' +
			'<startDate>2011-07-09</startDate>' +
			'<endDate>2011-08-08</endDate>' +
			'<usage>638021</usage></meterConsumption>' +
			'<meterConsumption estimatedValue="false"><id>-18</id><audit><createdBy>DUNAYT</createdBy><createdByAccountId>-14</createdByAccountId>' +
			' <createdDate>2012-05-25T09:59:06-04:00</createdDate><lastUpdatedBy>DUNAYT</lastUpdatedBy><lastUpdatedByAccountId>-14</lastUpdatedByAccountId>' +
			'<lastUpdatedDate>2012-05-25T09:59:06-04:00</lastUpdatedDate></audit><startDate>2011-06-09</startDate><endDate>2011-07-09</endDate>' +
			'<usage>625291</usage></meterConsumption><meterConsumption estimatedValue="false"><id>-17</id><audit><createdBy>DUNAYT</createdBy>' +
			' <createdByAccountId>-14</createdByAccountId><createdDate>2012-05-25T09:59:06-04:00</createdDate><lastUpdatedBy>DUNAYT</lastUpdatedBy>' +
			' <lastUpdatedByAccountId>-14</lastUpdatedByAccountId><lastUpdatedDate>2012-05-25T09:59:06-04:00</lastUpdatedDate> </audit>' +
			'<startDate>2011-05-10</startDate><endDate>2011-06-09</endDate><usage>610219</usage></meterConsumption>' +
			'<links><link httpMethod="get" link="/meter/100/consumptionData?page=2" linkDescription="next page"/></links></meterData>';

		let meterReading = [];

		parseString(xml, function (err, result) {
			if (err) {
				throw err;
				// console.log(err)
			}

			json_res = JSON.stringify(result, null, 2);
			json_obj = JSON.parse(json_res);
			json_obj = json_obj.meterData.meterConsumption;
			// console.log(json_obj);

			json_obj.forEach((reading) => {
				console.log({ json_obj });

				meterReading.push({
					id: '123',
					estimatedValue: reading['$'].estimatedValue,
					startDate: reading.startDate.toString(),
					endDate: reading.endDate.toString(),
					usage: reading.usage.toString(),
				});
			});

			// Save meters data in to SQL server
			res.send(meterReading);
		});
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;