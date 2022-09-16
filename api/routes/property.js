const express = require('express');
const axios = require('axios');
const { Property } = require('../../db/models');
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
			let propertyList = propertyData.links.link;
			
			let properties = propertyList.map(item => { 
				let propertyId = parseInt(item.id);

				return axios.get(BASE_URL + `/property/${propertyId}`, config)
					.then(response => parser.toJson(response.data, options))
					.then(propertyObj => {
							let { property } = propertyObj;

						console.log(property)
							const {
								name,
								address,
								numberOfBuildings,
								yearBuilt,
								grossFloorArea,
								occupancyPercentage,
								isFederalProperty,
								notes,
							} = property;

							let property_obj = {
							id: propertyId,
							name,
							streetAddress: typeof address === 'undefined' ? '' : address.address1,
							city: typeof address === 'undefined' ? '' : address.city,
							state: typeof address === 'undefined' ? '' : address.state,
							postalCode: typeof address === 'undefined' ? '' : address.postalCode,
							country: typeof address === 'undefined' ? '' : address.country,
							numberOfBuildings: numberOfBuildings,
							yearBuilt: yearBuilt,
							grossFloorArea:
								typeof grossFloorArea === 'undefined' ? '' : grossFloorArea.value,
							grossFloorAreaUnits:
								typeof grossFloorArea === 'undefined'
									? ''
									: grossFloorArea['units'],
							occupancyPercentage: occupancyPercentage,
							isFederalProperty: isFederalProperty,
							notes: notes,
						};

						Property.updateOrCreate(property_obj);
						return property_obj;
						
					})
			})
			const results = await Promise.all(properties);
			res.send(results);
		}
		
	} catch (error) {
		console.log(error)
	}
});


router.get('/', (req, res, next) => {
  Property.findAll()
	.then(properties => res.send(properties))
	.catch(next)
})

router.get('/id-list', (req, res, next) => {
	Property.findAll()
		.then((list) => list.map((item) => item.id))
		.then((IdList) => res.send(IdList))
		.catch(next);
});

module.exports = router;