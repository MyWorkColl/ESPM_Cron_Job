const express = require('express');
const axios = require('axios');
const { Property } = require('../../db/models');
require('dotenv').config();

const router = express.Router();
router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, BASE_URL, ESPM_ACCOUNT_ID } = process.env;
const auth = { 'username': ESPM_USERNAME, 'password': ESPM_PW}

const parseString = require('xml2js').parseString;

router.post('/', async (req, res, next) => {
	try {
		// Handle 'Get Properties' api response
		const response = await axios.get(
			BASE_URL + `/account/${ESPM_ACCOUNT_ID}/property/list`,
			{
				headers: {
					'content-type': 'application/xml',
				},
				auth,
			}
		);
		const xml = response.data

		parseString(xml, function (err, result) {
			if (err) {
				throw err;
			}

			let json_res = JSON.stringify(result, null, 2);
			let json_obj = JSON.parse(json_res);
			json_obj = json_obj.response.links[0].link;
			propertyList = json_obj;

			let properties = [];

			const test = propertyList.forEach(async (item) => {
				const propertyId = parseInt(item['$'].id);

				const propertyDetail = await axios.get(
					BASE_URL + `/property/${propertyId}`,
					{
						headers: {
							'content-type': 'application/xml',
						},
						auth,
					}
				);
				const xml_2 = propertyDetail.data;

				parseString(xml_2, function (err, result) {
					if (err) {
						throw err;
					}

					let json_res = JSON.stringify(result, null, 2);
					let json_obj = JSON.parse(json_res);
					let propertyDetail = json_obj.property;
					let {
						name,
						address,
						numberOfBuildings,
						yearBuilt,
						grossFloorArea,
						occupancyPercentage,
						isFederalProperty,
						notes,
					} = propertyDetail;

					let property_obj = {
						id: propertyId,
						name: name ? name.toString() : '',
						streetAddress: address.length > 0 ? address[0]['$'].address1 : '',
						city: address.length > 0 ? address[0]['$'].city : '',
						state: address.length > 0 ? address[0]['$'].state : '',
						postalCode: address.length > 0 ? address[0]['$'].postalCode : '',
						country: address.length > 0 ? address[0]['$'].country : '',
						numberOfBuildings: numberOfBuildings
							? numberOfBuildings.toString()
							: '',
						yearBuilt: yearBuilt ? yearBuilt.toString() : '',
						grossFloorArea:
							grossFloorArea.length > 0
								? grossFloorArea[0].value.toString()
								: '',
						grossFloorAreaUnits:
							grossFloorArea.length > 0 ? grossFloorArea[0]['$']['units'] : '',
						occupancyPercentage: occupancyPercentage
							? occupancyPercentage.toString()
							: '',
						isFederalProperty: isFederalProperty
							? isFederalProperty.toString()
							: '',
						notes: notes ? notes.toString() : '',
					};

					Property.updateOrCreate(property_obj);
					properties.push(property_obj);
					return property_obj
				});
			});

			res.status(400).send('Property information created or updated.')

			// Property.bulkCreate(
			// 	properties.map((property) => property),
			// 	{ returning: true }
			// )
			// .then((propertyList) => {
			// 	res.send(propertyList);
			// })
			// .catch(next);
		});
				
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