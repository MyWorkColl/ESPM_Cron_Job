const express = require('express');
const axios = require('axios');
const { Meter } = require('../../db/models');
require('dotenv').config();

const router = express.Router();
router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, ESPM_BASE_URL } = process.env
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


router.post('/', (req, res, next) => {
    try {
        
        // Handle 'Get Associated Property Meters' api response
        const xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><meterPropertyAssociationList>'
            +'<energyMeterAssociation><meters><meterId>2405821</meterId><meterId>2405866</meterId><meterId>2535377</meterId><meterId>2548776</meterId>'
            +'<meterId>5262730</meterId><meterId>12272470</meterId><meterId>12272471</meterId><meterId>12272472</meterId><meterId>20668451</meterId>'
            + '<meterId>20668992</meterId><meterId>21880194</meterId></meters><propertyRepresentation>'
            +'< propertyRepresentationType > Whole Property</propertyRepresentationType></propertyRepresentation ></energyMeterAssociation>'
            +'<waterMeterAssociation><meters><meterId>6005104</meterId></meters><propertyRepresentation><propertyRepresentationType>Whole Property</propertyRepresentationType>'
            +'</propertyRepresentation></waterMeterAssociation><wasteMeterAssociation><meters><meterId>55593078</meterId><meterId>55593121</meterId>'
            +'</meters></wasteMeterAssociation></meterPropertyAssociationList>'
        
        let meters = []
        let associationList = []

        parseString(xml, function (err, result) {
            if (err) {
                throw err;
            }
            
            let json_res = JSON.stringify(result, null, 2)
            let json_obj = JSON.parse(json_res)
            json_obj = json_obj.meterPropertyAssociationList
            associationList = Object.keys(json_obj)

            associationList.forEach(item => {
                let arr = json_obj[item][0].meters[0].meterId
                arr.forEach(id => {

                    // Replace this to axios get request 
                    const xml_2 ='<?xml version="1.0" encoding="UTF-8"?><meter><id>1</id><type>Electric</type>' 
                                +'<name>Electric Main Meter</name><unitOfMeasure>kBtu (thousand Btu)</unitOfMeasure>' 
                                +'<metered>true</metered><firstBillDate>2010-01-01</firstBillDate><inUse>true</inUse>' 
                                +'<accessLevel>Read</accessLevel><audit><createdBy>DUNAYT</createdBy><createdByAccountId>-14</createdByAccountId>'
                                + '< createdDate > 2012 - 08 - 16T17: 04:57 - 04: 00</createdDate >< lastUpdatedBy > DUNAYT</lastUpdatedBy> <lastUpdatedByAccountId>-14</lastUpdatedByAccountId>'
                                +'<lastUpdatedDate>2012-08-16T17:09:35-04:00</lastUpdatedDate></audit></meter>';

                    parseString(xml_2, function (err, result) {
                        if (err) {
                            throw err;
                        }

                        let json_res = JSON.stringify(result, null, 2);
                        let json_obj = JSON.parse(json_res);
                        let meterDetail = json_obj.meter;
                        let {name, type, unitOfMeasure, metered, firstBillDate, inUse, accessLevel} = meterDetail;

                        meters.push({
                            id: id,
                            name: name.toString(),
                            type: type.toString(),
                            associationGroup: item,
                            unitOfMeasure: unitOfMeasure.toString(),
                            metered: metered.toString(),
                            firstBillDate: firstBillDate.toString(),
                            inUse: inUse.toString(),
                            accessLevel: accessLevel.toString(),
                        });
                    });
                })
            })

        // Save meters data in to SQL server
           res.send(meters)
        });
       
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