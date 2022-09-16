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
	const config = {
		headers: {
			'content-type': 'application/xml',
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
			config
			);
		let dataObj = parser.toJson(data, options);
		let propertyData = dataObj.response;
		
		if (typeof propertyData.links === 'undefined' || typeof propertyData.links.link == 'undefined') {
			res.send('no property data');
			
		} else {
			let propertyList = propertyData.links.link.slice(0, 2);
			
			let metrics = propertyList.map(item => { 
				let propertyId = parseInt(item.id);
				let endingYear = 2022;
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

						console.log(propertyMetrics);
						return propertyMetrics;
						// const {
						// 	name,
						// } = propertyMetrics;

						// let property_obj = {
						// 	id: propertyId,
						// 	name,
						// 	streetAddress:
						// 		typeof address === 'undefined' ? '' : address.address1,
						// 	city: typeof address === 'undefined' ? '' : address.city,
						// 	state: typeof address === 'undefined' ? '' : address.state,
						// 	postalCode:
						// 		typeof address === 'undefined' ? '' : address.postalCode,
						// 	country: typeof address === 'undefined' ? '' : address.country,
						// 	numberOfBuildings: numberOfBuildings,
						// 	yearBuilt: yearBuilt,
						// 	grossFloorArea:
						// 		typeof grossFloorArea === 'undefined'
						// 			? ''
						// 			: grossFloorArea.value,
						// 	grossFloorAreaUnits:
						// 		typeof grossFloorArea === 'undefined'
						// 			? ''
						// 			: grossFloorArea['units'],
						// 	occupancyPercentage: occupancyPercentage,
						// 	isFederalProperty: isFederalProperty,
						// 	notes: notes,
						// };

						// Property.updateOrCreate(property_obj);
						// return property_obj;
					});
			})
			const results = await Promise.all(metrics);
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