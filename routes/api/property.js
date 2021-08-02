const express = require('express');
const axios = require('axios');
const { Property } = require('../../db/models');
require('dotenv').config();

const router = express.Router();
router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, ESPM_BASE_URL } = process.env
const auth = { 'username': ESPM_USERNAME, 'password': ESPM_PW}

const parseString = require('xml2js').parseString;

// const { json } = require('sequelize/types');

// //test parseSTring
// parseString(xml, function (err, result) {
//   json_res = JSON.stringify(result.response.links, null, 2)
//   json_obj = JSON.parse(json_res)[0].link
// });

// json_obj.forEach(item => {
//     property = {}
//     property.id = item['$'].id
//     property.name = item['$'].hint
//     console.log(property)
//   }
// )

// router.post('/', (req, res, next) => {
//   Property.findOrCreate({ where: { id: req.params.id } })
//     .then((property) => res.send(property))
//     .catch(next);
// });

// const data = async function getProperty() {
//   try {
//     const response = await axios.get(ESPM_BASE_URL + `/account`, {
//       headers: {
//         'content-type': 'application/xml'
//       },
//       auth 
//     })
    
//     let json_res = '';
//     let json_obj = '';
    
//     parseString(response.data, function (err, result) {
//       json_res = JSON.stringify(result, null, 2)
//       json_obj = JSON.parse(json_res)
//     })

//     return json_obj.account
//   } catch (error) {
//     console.error(error.response)
//   }

// }

// async function getProperty() {
//   return (await axios.get(ESPM_BASE_URL + `/account`, {
//     headers: {
//       'content-type': 'application/xml'
//     },
//     auth 
//   })).data
// }
    
// getProperty()
//   .then(xml => {
    
//     let json_res = '';
//     let json_obj = '';
    
//     parseString(xml, function (err, result) {
//       json_res = JSON.stringify(result, null, 2)
//       json_obj = JSON.parse(json_res)
//     })
//     console.log(json_obj.account)
//   })
//   .catch(err => console.log(err))


// router.post('/', (req, res, next) => {
//   getProperty()
//   .then(xml => {
    
//     let json_res = '';
//     let json_obj = '';
    
//     parseString(xml, function (err, result) {
//       json_res = JSON.stringify(result, null, 2)
//       json_obj = JSON.parse(json_res)
//     })
//     res.send(json_obj.account)
//   })
//   .catch(err => console.log(err))
// });

// router.get('/', (req, res, next) => {
//   axios.get(ESPM_BASE_URL + `/account`, {
//     headers: {
//       'content-type': 'application/xml'
//     },
//     auth 
//   })
//     .then(response => response.data)
//     .then(xml => {
//       let json_res = '';
//       let json_obj = '';

//       parseString(xml, function (err, results) {
//         // Is this necessary?
//         if (err) {
//           throw err;
//         }
//         json_res = JSON.stringify(results, null, 2)
//         json_obj = JSON.parse(json_res)
//       })

//     //   Property.findOrCreate({ where: { id } })
//       res.send(json_obj.account)
//     })
//     .catch((error) =>
//       {
//         // Handling errors using promises 
//         if (error.response) {
//             console.log(error.response.data);
//             console.log(error.response.status);
//             console.log(error.response.headers);
//         } else if (error.request) {
//             console.log(error.request);
//         } else {
//             // Something happened in setting up the request and triggered an Error
//             console.log('Error', error.message);
//         }
//         console.log(error.config);
//     })
// })

router.post('/', (req, res, next) => {
	try {
		// Handle 'Get Associated Property Meters' api response
		const xml =
			`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><response status="Ok"><links>` +
			`<link id="1677104" hint="1301 Avenue of the Americas" linkDescription="This is the GET url for this Property." link="/property/1677104" httpMethod="GET"/>` +
			`<link id="2303907" hint="Rose Building" linkDescription="This is the GET url for this Property." link="/property/2303907" httpMethod="GET"/>` +
			`<link id="3421983" hint="575 Lexington" linkDescription="This is the GET url for this Property." link="/property/3421983" httpMethod="GET"/>` +
			`<link id="4040793" hint="245 West 17th Street" linkDescription="This is the GET url for this Property." link="/property/4040793" httpMethod="GET"/>` +
			`<link id="4296832" hint="90 Maiden Lane" linkDescription="This is the GET url for this Property." link="/property/4296832" httpMethod="GET"/>` +
			`<link id="4744639" hint="Building B" linkDescription="This is the GET url for this Property." link="/property/4744639" httpMethod="GET"/>` +
			`<link id="4995103" hint="CXP - 125 West 25th Street" linkDescription="This is the GET url for this Property." link="/property/4995103" httpMethod="GET"/>` +
			`<link id="5051651" hint="22 West 32nd Street" linkDescription="This is the GET url for this Property." link="/property/5051651" httpMethod="GET"/>` +
			`<link id="6595195" hint="1633 Broadway" linkDescription="This is the GET url for this Property." link="/property/6595195" httpMethod="GET"/>` +
			`<link id="7557791" hint="61-56 SPRINGFIELD BOULEVARD" linkDescription="This is the GET url for this Property." link="/property/7557791" httpMethod="GET"/>` +
			`<link id="15175517" hint="LBJ Realty Company" linkDescription="This is the GET url for this Property." link="/property/15175517" httpMethod="GET"/>` +
			`<link id="15632583" hint="80 &amp; 90 Maiden Lane" linkDescription="This is the GET url for this Property." link="/property/15632583" httpMethod="GET"/>` +
			`<link id="2257159" hint="Parking Garages" linkDescription="This is the GET url for this Property." link="/property/2257159" httpMethod="GET"/>` +
			`<link id="2290901" hint="St. Mary's High School" linkDescription="This is the GET url for this Property." link="/property/2290901" httpMethod="GET"/>` +
			`<link id="2743248" hint="315 Park Avenue South" linkDescription="This is the GET url for this Property." link="/property/2743248" httpMethod="GET"/>` +
			`<link id="6281424" hint="A&amp;E Television" linkDescription="This is the GET url for this Property." link="/property/6281424" httpMethod="GET"/>` +
			`<link id="1831281" hint="Albert Einstein" linkDescription="This is the GET url for this Property." link="/property/1831281" httpMethod="GET"/>` +
			`<link id="2267635" hint="137 Varick" linkDescription="This is the GET url for this Property." link="/property/2267635" httpMethod="GET"/>` +
			`<link id="2267700" hint="151 AOA" linkDescription="This is the GET url for this Property." link="/property/2267700" httpMethod="GET"/>` +
			`<link id="2267753" hint="One Hudson Square" linkDescription="This is the GET url for this Property." link="/property/2267753" httpMethod="GET"/>` +
			`<link id="2689243" hint="80 Maiden Lane" linkDescription="This is the GET url for this Property." link="/property/2689243" httpMethod="GET"/>` +
			`<link id="2806019" hint="45 Broadway" linkDescription="This is the GET url for this Property." link="/property/2806019" httpMethod="GET"/>` +
			`<link id="3122419" hint="1995 Broadway" linkDescription="This is the GET url for this Property." link="/property/3122419" httpMethod="GET"/>` +
			`<link id="3413981" hint="New York Design Center" linkDescription="This is the GET url for this Property." link="/property/3413981" httpMethod="GET"/>` +
			`<link id="3614709" hint="Riverbay Fund Corporation" linkDescription="This is the GET url for this Property." link="/property/3614709" httpMethod="GET"/>` +
			`<link id="11857501" hint="1370 Broadway TEST" linkDescription="This is the GET url for this Property." link="/property/11857501" httpMethod="GET"/>` +
			`<link id="1472861" hint="1633 Broadway - Paramount Plaza" linkDescription="This is the GET url for this Property." link="/property/1472861" httpMethod="GET"/>` +
			`<link id="1578383" hint="1325 Avenue of the Americas" linkDescription="This is the GET url for this Property." link="/property/1578383" httpMethod="GET"/>` +
			`<link id="2027240" hint="Lowenstein" linkDescription="This is the GET url for this Property." link="/property/2027240" httpMethod="GET"/>` +
			`<link id="2257856" hint="Ford Foundation" linkDescription="This is the GET url for this Property." link="/property/2257856" httpMethod="GET"/>` +
			`<link id="2681425" hint="Rising Sam Ditmars LLC" linkDescription="This is the GET url for this Property." link="/property/2681425" httpMethod="GET"/>` +
			`<link id="3070619" hint="229 West 43rd Street - Current" linkDescription="This is the GET url for this Property." link="/property/3070619" httpMethod="GET"/>` +
			`<link id="3122411" hint="39 Broadway" linkDescription="This is the GET url for this Property." link="/property/3122411" httpMethod="GET"/>` +
			`<link id="3405287" hint="1370 Broadway" linkDescription="This is the GET url for this Property." link="/property/3405287" httpMethod="GET"/>` +
			`<link id="5985867" hint="310 east 14th Street" linkDescription="This is the GET url for this Property." link="/property/5985867" httpMethod="GET"/>` +
			`<link id="1501971" hint="712 Fifth Avenue" linkDescription="This is the GET url for this Property." link="/property/1501971" httpMethod="GET"/>` +
			`<link id="1674432" hint="31 West Fifty Second" linkDescription="This is the GET url for this Property." link="/property/1674432" httpMethod="GET"/>` +
			`<link id="2711594" hint="New York Academy of Medicine" linkDescription="This is the GET url for this Property." link="/property/2711594" httpMethod="GET"/>` +
			`<link id="3539832" hint="114 5th Avenue" linkDescription="This is the GET url for this Property." link="/property/3539832" httpMethod="GET"/>` +
			`<link id="4045873" hint="19 West 55th street" linkDescription="This is the GET url for this Property." link="/property/4045873" httpMethod="GET"/>` +
			`<link id="4838673" hint="38 W 32nd St." linkDescription="This is the GET url for this Property." link="/property/4838673" httpMethod="GET"/>` +
			`<link id="6311854" hint="39-15 MAIN STREET" linkDescription="This is the GET url for this Property." link="/property/6311854" httpMethod="GET"/>` +
			`<link id="6668199" hint="CXP- 888 Broadway" linkDescription="This is the GET url for this Property." link="/property/6668199" httpMethod="GET"/>` +
			`<link id="6898231" hint="149 Madison Ave" linkDescription="This is the GET url for this Property." link="/property/6898231" httpMethod="GET"/>` +
			`<link id="2238696" hint="Lincoln Center Performing Arts" linkDescription="This is the GET url for this Property." link="/property/2238696" httpMethod="GET"/>` +
			`<link id="2265354" hint="435 Hudson" linkDescription="This is the GET url for this Property." link="/property/2265354" httpMethod="GET"/>` +
			`<link id="2290844" hint="St. Dominic's High School" linkDescription="This is the GET url for this Property." link="/property/2290844" httpMethod="GET"/>` +
			`<link id="3614446" hint="Fordham University - Lincoln Center" linkDescription="This is the GET url for this Property." link="/property/3614446" httpMethod="GET"/>` +
			`<link id="3614753" hint="Trinity Real Estate" linkDescription="This is the GET url for this Property." link="/property/3614753" httpMethod="GET"/>` +
			`<link id="3614952" hint="Lincoln Center for Performing Arts" linkDescription="This is the GET url for this Property." link="/property/3614952" httpMethod="GET"/>` +
			`<link id="4744624" hint="1199 Housing Corp." linkDescription="This is the GET url for this Property." link="/property/4744624" httpMethod="GET"/>` +
			`<link id="1833707" hint="Sarah Neuman Center" linkDescription="This is the GET url for this Property." link="/property/1833707" httpMethod="GET"/>` +
			`<link id="2221781" hint="Juilliard" linkDescription="This is the GET url for this Property." link="/property/2221781" httpMethod="GET"/>` +
			`<link id="2259094" hint="225 Varick" linkDescription="This is the GET url for this Property." link="/property/2259094" httpMethod="GET"/>` +
			`<link id="2267671" hint="100 AOA" linkDescription="This is the GET url for this Property." link="/property/2267671" httpMethod="GET"/>` +
			`<link id="2267729" hint="345 Hudson" linkDescription="This is the GET url for this Property." link="/property/2267729" httpMethod="GET"/>` +
			`<link id="4123405" hint="249 West 17th Street" linkDescription="This is the GET url for this Property." link="/property/4123405" httpMethod="GET"/>` +
			`<link id="4744648" hint="Building D" linkDescription="This is the GET url for this Property." link="/property/4744648" httpMethod="GET"/>` +
			`<link id="4860596" hint="34 W 32nd St." linkDescription="This is the GET url for this Property." link="/property/4860596" httpMethod="GET"/>` +
			`<link id="1479144" hint="900 Third Ave" linkDescription="This is the GET url for this Property." link="/property/1479144" httpMethod="GET"/>` +
			`<link id="1511892" hint="745 Fifth Ave." linkDescription="This is the GET url for this Property." link="/property/1511892" httpMethod="GET"/>` +
			`<link id="2027098" hint="McMahon Building" linkDescription="This is the GET url for this Property." link="/property/2027098" httpMethod="GET"/>` +
			`<link id="2269070" hint="109 Greenwich St." linkDescription="This is the GET url for this Property." link="/property/2269070" httpMethod="GET"/>` +
			`<link id="2816242" hint="42 Broadway" linkDescription="This is the GET url for this Property." link="/property/2816242" httpMethod="GET"/>` +
			`<link id="3837245" hint="Holiday Inn - 540 West 48th" linkDescription="This is the GET url for this Property." link="/property/3837245" httpMethod="GET"/>` +
			`<link id="4047212" hint="15 W 55 ST" linkDescription="This is the GET url for this Property." link="/property/4047212" httpMethod="GET"/>` +
			`<link id="4744633" hint="Building A" linkDescription="This is the GET url for this Property." link="/property/4744633" httpMethod="GET"/>` +
			`<link id="4744645" hint="Building C" linkDescription="This is the GET url for this Property." link="/property/4744645" httpMethod="GET"/>` +
			`<link id="4802833" hint="218 West 18th Street" linkDescription="This is the GET url for this Property." link="/property/4802833" httpMethod="GET"/>` +
			`<link id="5985863" hint="NYEE" linkDescription="This is the GET url for this Property." link="/property/5985863" httpMethod="GET"/>` +
			`<link id="6808818" hint="90 Maiden Lane" linkDescription="This is the GET url for this Property." link="/property/6808818" httpMethod="GET"/>` +
			`</links></response>`;

		let properties = [];

		parseString(xml, function (err, result) {
			if (err) {
				throw err;
			}

			let json_res = JSON.stringify(result, null, 2);
			let json_obj = JSON.parse(json_res);
			json_obj = json_obj.response.links[0].link;
			propertyList = json_obj;

			propertyList.forEach((item) => {
				const id = parseInt(item['$'].id);

				// console.log(id)

				// Replace this to axios get request /property/(propertyId)
				const xml_2 =
					`<?xml version="1.0" encoding="UTF-8"?><property>`
					+`<name>8041- Richmond Road - Score 58+</name>`
					+`<primaryFunction>Refrigerated Warehouse</primaryFunction>`
					+`<address address1="5300 Richmond Road" city="Bedford Heights" postalCode="44146" state="OH" country="US"/>`
					+`<numberOfBuildings>1</numberOfBuildings>`
					+`<yearBuilt>1992</yearBuilt>`
					+`<constructionStatus>Existing</constructionStatus>`
					+`<grossFloorArea units="Square Feet" temporary="false"><value>856655</value></grossFloorArea>`
					+`<occupancyPercentage>10</occupancyPercentage>`
					+`<isFederalProperty>true</isFederalProperty>`
					+`<agency name="Advisory Council on Historic Preservation (ACHP)" code="ACHP" id="1" country="US"/>`
					+`<agencyDepartmentRegion>region update</agencyDepartmentRegion>`
					+`<federalCampus>campus update</federalCampus>`
					+`<notes>`+`<![CDATA[Permit license >5 years old.]]></notes>`
					+`<accessLevel>Read Write+</accessLevel>`
					+`<audit><createdBy>DUNAYT</createdBy>`
					+`<createdByAccountId>-14</createdByAccountId>`
					+`<createdDate>2012-08-16T17:04:57-04:00</createdDate>`
					+`<lastUpdatedBy>DUNAYT</lastUpdatedBy>`
					+`<lastUpdatedByAccountId>-14</lastUpdatedByAccountId>`
					+`<lastUpdatedDate>2012-08-16T17:09:35-04:00</lastUpdatedDate>`
					+ `</audit></property>`;
				
				parseString(xml_2, function (err, result) {
					if (err) {
						throw err;
					}

					let json_res = JSON.stringify(result, null, 2);
					let json_obj = JSON.parse(json_res);
					let propertyDetail = json_obj.property;

					// console.log(propertyDetail)

					let {
						name,
						address,
						numberOfBuildings,
						yearBuilt,
						grossFloorArea,
						occupancyPercentage,
						isFederalProperty,
						notes
					} = propertyDetail;

					let property_obj = {
						id: id,
						name: name.toString(),
						streetAddress: address[0]['$'].address1,
						city: address[0]['$'].city,
						state: address[0]['$'].state,
						postalCode: address[0]['$'].postalCode,
						country: address[0]['$'].country,
						numberOfBuildings: numberOfBuildings.toString(),
						yearBuilt: yearBuilt.toString(),
						grossFloorArea: grossFloorArea[0].value.toString(),
						grossFloorAreaUnits: grossFloorArea[0]['$']['units'],
						occupancyPercentage: occupancyPercentage.toString(),
						isFederalProperty: isFederalProperty.toString(),
						notes: notes.toString(),
					};
						
					properties.push(property_obj);
				});
			});

			Property.bulkCreate(
				properties.map(property => (property)),
				{returning: true}
			)
				.then(propertyList => {
					res.send(properties);
				})
				.catch(next)
				;
		});
	} catch (error) {
		console.log(error);
	}
});


router.get('/', (req, res, next) => {
  Property.findAll()
    .then(properties => res.send(properties))
  .catch(next)
})

module.exports = router;