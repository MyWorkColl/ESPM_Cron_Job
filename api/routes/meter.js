const express = require('express');
const axios = require('axios');
const { Meter, Property } = require('../../db/models');
require('dotenv').config();

const router = express.Router();
router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, BASE_URL } = process.env;
const auth = { 'username': ESPM_USERNAME, 'password': ESPM_PW}

// Test xml parse
const parseString = require('xml2js').parseString;
// const xml = '<?xml version="1.0" encoding="UTF-8"?><meterPropertyAssociationList>'
//                 +'<energyMeterAssociation>'
//                 +'<meters>'
//                 +'<meterId>543</meterId>'
//                 +'<meterId>2</meterId>'
//                 +'</meters>'
//                 +'<propertyRepresentation>'
//                 +'<propertyRepresentationType>Whole Property</propertyRepresentationType>'
//                 +'</propertyRepresentation>'
//                 +'</energyMeterAssociation>'
//                 +'<waterMeterAssociation><meters><meterId>10</meterId><meterId>20</meterId></meters><propertyRepresentation><propertyRepresentationType>Whole Property</propertyRepresentationType>'
//                 +'</propertyRepresentation></waterMeterAssociation>'
//     + '<wasteMeterAssociation><meters><meterId>100</meterId><meterId>200</meterId></meters></wasteMeterAssociation></meterPropertyAssociationList>'
                
// parseString(xml, function (err, result) {
//     if (err) {
//         throw err;
//     }

//     json_res = JSON.stringify(result, null, 2)
//     json_obj = JSON.parse(json_res)
//     json_obj = json_obj.meterPropertyAssociationList
// });

// let associationList = Object.keys(json_obj)

// let meterAssociation = []
// associationList.forEach(item => {
//     let arr = json_obj[item][0].meters[0].meterId
//     arr.forEach(id => {
//         meterAssociation.push({id, associationGroup: item})
//     })
// })

// console.log(meterAssociation)

// let meters = []
// meterAssociation.forEach(meter => {

//     // this will be replaced to axios meter get api request
//     if (meter.id == 543) {
//         const xml_2 = '<?xml version="1.0" encoding="UTF-8"?><meter><id>543</id><type>Electric</type>'
//         +'<name>Electric Main Meter</name>'
//         +'<unitOfMeasure>kBtu (thousand Btu)</unitOfMeasure>'
//         +'<metered>true</metered>'
//         +'<firstBillDate>2010-01-01</firstBillDate>'
//         +'<inUse>true</inUse>'
//         +'<accessLevel>Read</accessLevel>'
//         + '<audit><createdBy>DUNAYT</createdBy><createdByAccountId>-14</createdByAccountId><createdDate>2012-08-16T17:04:57-04:00</createdDate>'
//         +'< lastUpdatedBy > DUNAYT</lastUpdatedBy> <lastUpdatedByAccountId>-14</lastUpdatedByAccountId>'
//             + '<lastUpdatedDate>2012-08-16T17:09:35-04:00</lastUpdatedDate></audit></meter>'

//         parseString(xml_2, function (err, result) {
//             if (err) {
//                 throw err;
//             }

//             let json_res = JSON.stringify(result, null, 2)
//             let json_obj = JSON.parse(json_res)
//             let meterDetail = json_obj.meter
//             // console.log("write-->", json_obj)
            
//             let { name, type, associationGroup, unitOfMeasure, metered, firstBillDate, inUse, accessLevel } = meterDetail
           
//             meters.push({
// 							id: meter.id,
// 							name: name.toString(),
// 							type: type.toString(),
// 							associationGroup: meter.associationGroup,
// 							unitOfMeasure: unitOfMeasure.toString(),
// 							metered: metered.toString(),
// 							firstBillDate: firstBillDate.toString(),
// 							inUse: inUse.toString(),
// 							accessLevel: accessLevel.toString(),
// 						});
//         });
//     }
// })


router.post('/', async (req, res, next) => {
    try {
        let meterData = [];
        let associationList = [];

        const config = {
					headers: {
						'content-type': 'application/xml',
					},
					auth,
				};
        
        // const propertyIdList = await Property.getIdList()
        propertyIdList = [1677104, 1472861];

        propertyIdList.forEach(async (propertyId) => {
            const response = await axios.get(
                BASE_URL + `/association/property/${propertyId}/meter`,
                config
            );
            const xml = response.data;
            console.log(xml)
            parseString(xml, function (err, result) {
                if (err) {
                    throw err;
                }

                let json_res = JSON.stringify(result, null, 2);
                let json_obj = JSON.parse(json_res);
                json_obj = json_obj.meterPropertyAssociationList;
                associationList = Object.keys(json_obj);

                associationList.forEach((item) => {
                    console.log(`${propertyId} -----> ${item}--> ${json_obj[item][0].meters[0].meterId}`);

                    if (item != 'wasteMeterAssociation') {
                        // Get the list of meter id for each association (energyMeterAssociation, waterMeterAssociation, wasteMeterAssociation)
                        let arr = json_obj[item][0].meters[0].meterId;
                    
                        arr.forEach(async (meterId) => {
                            // Replace this to axios get request
                            const response_2 = await axios.get(
                                BASE_URL + `/meter/${meterId}`,
                                config
                            );
                            const xml_2 = response_2.data;

                            parseString(xml_2, function (err, result) {
                                if (err) {
                                    throw err;
                                }

                                let json_res = JSON.stringify(result, null, 2);
                                let json_obj = JSON.parse(json_res);
                                let meterDetail = json_obj.meter;
                                let {
                                    id,
                                    name,
                                    type,
                                    unitOfMeasure,
                                    metered,
                                    firstBillDate,
                                    inUse,
                                    accessLevel,
                                } = meterDetail;
                                let meter_obj = {
                                    id: id.toString(),
                                    name: name.toString(),
                                    type: type.toString(),
                                    associationGroup:  item,
                                    unitOfMeasure: unitOfMeasure.toString(),
                                    metered: metered.toString(),
                                    firstBillDate: firstBillDate.toString(),
                                    inUse: inUse.toString(),
                                    accessLevel: accessLevel.toString(),
                                    PropertyId: propertyId,
                                };

                                console.log(meter_obj);
                                Meter.updateOrCreate(meter_obj);
                                // meterData.push(meter_obj);
                            });
                        });
                    }    
                });
            });
            
        });
        res.status(400).send('Property information created or updated.');
		} catch (error) {
        console.log(error)
    }
})

router.get('/', (req, res, next) => {
	Meter.findAll()
		.then((meter) => res.send(meter))
		.catch(next);
});

module.exports = router;
