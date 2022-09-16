const express = require('express');
const axios = require('axios');
const { Score } = require('../../db/models');
const { config } = require('dotenv');
const parser = require('xml2json');

require('dotenv').config();

const router = express.Router();
router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, BASE_URL, ESPM_ACCOUNT_ID } = process.env;
const auth = { 'username': ESPM_USERNAME, 'password': ESPM_PW}


router.post('/', async (req, res, next) => {
	let config = {
		headers: {
			'content-type': 'application/xml',
			'PM-Metrics':
				'score, totalGHGEmissionsIntensity, propGrossFloorArea, siteEnergyUseElectricityGridPurchaseKwh, siteEnergyUseElectricityGridPurchase, siteEnergyUseNaturalGasTherms, siteEnergyUseNaturalGas, siteEnergyUseFuelOil2, siteEnergyUseFuelOil4, siteEnergyUseDistrictSteam',
		},
		auth,
	};
	

	const options = {
		object: true
	};

	try {
		// Handle 'Get Properties' api response
		let {data} = await axios.get(
			BASE_URL + `/account/${ESPM_ACCOUNT_ID}/property/list`,
			{
					headers: {
						'content-type': 'application/xml'
					},
					auth,
			});
		let dataObj = parser.toJson(data, options);
		let propertyData = dataObj.response;
		
		if (typeof propertyData.links === 'undefined' || typeof propertyData.links.link == 'undefined') {
			res.send('no property data');
			
		} else {
			let propertyList = propertyData.links.link.slice(0, 2);
			
			let metrics = propertyList.map(item => { 
				let propertyId = parseInt(item.id);
				let endingYear = 2021;
				// December is the ending month
				let endingMonth = 12;

				return axios
					.get(
						BASE_URL +
							`/property/${propertyId}/metrics?year=${endingYear}&month=${endingMonth}&measurementSystem=EPA`,
						config
					)
					.then((response) => parser.toJson(response.data, options))
					.then((propertyObj) => {
						let { propertyMetrics } = propertyObj;
						let metric = (typeof propertyMetrics.metric === 'undefined') ? '' : propertyMetrics.metric;
						console.log(metric);

						// filter the metric 
						filtered = metric.filter(item => !!(item.uom) )
						return metric.map(item => {
							let { name, uom, value } = item;

							let metricObj = {
								name,
								uom,
								value,
								endingYear,
								endingMonth,
								value,
								propertyId: propertyId,
							};

							Score.updateOrCreate(metricObj);
							return metricObj;

						 });


					});
			})
			const results = await Promise.all(metrics);
			// Score.bulkCreate(results)
			res.send(results);
		}
		
	} catch (error) {
		console.log(error)
	}
});


router.get('/', (req, res, next) => {
  Score.findAll()
	.then(metrics => res.send(metrics))
	.catch(next)
})

module.exports = router;