const express = require('express');
const axios = require('axios');
const { Meter, Property, Error } = require('../../db/models');
const parser = require('xml2json');
const { response } = require('express');
require('dotenv').config();

const router = express.Router();
router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, BASE_URL, My_DOMAIN } = process.env;
const auth = { 'username': ESPM_USERNAME, 'password': ESPM_PW}

const config = {
	headers: {
		'content-type': 'application/xml',
		'Retry-After': '3600',
	},
	auth,
};

const options = {
            object: true,
};

router.post('/', async (req, res, next) => {
    try {
        const propertyIdList = await Property.getIdList();
        
        console.log(`No of Properties ---------------------> ${propertyIdList.length}`);
        let noOfProperties = propertyIdList.length
        
        if (noOfProperties == 0) {
            res.send('no properties');
        }

        let n = Math.floor(noOfProperties / 10);
        // let n = 28
        let results = [];

        for (i = 1; i <= n + 1; i++){
            let start =  10 * (i - 1);
            let end = Math.min(10 * i, noOfProperties);
            
            console.log(`${10 * (i - 1)} to ${Math.min(10 * i, noOfProperties)}`);

            const meterDataByProperty = propertyIdList.slice(start,end).map((propertyId) => {
                return axios
                    .post(My_DOMAIN + `/api/meter/property/${propertyId}`)
                    .then((response) => {
                        return response.data;
                    })
                    .catch((error) => {
                        console.log(`ERROR: ${propertyId} -------> ${error.message}`);
                        throw error;
                    });
            });

            const meterData = await Promise.all(meterDataByProperty);
            results.push(meterData);
        };

        res.send(results);

    } catch (error) {
        res.send(error.message)
    }
})

router.post('/property/:id', async (req, res, next) => {
    
    try {
        // Get the path params
        let propertyId = req.params.id;
        
        return axios
            .get(
                BASE_URL + `/association/property/${propertyId}/meter`,
                config
            )
            .then((response) => parser.toJson(response.data, options))
            .then(async (associationObj) => {
                let { meterPropertyAssociationList } = associationObj;

                associationList = Object.keys(meterPropertyAssociationList);
                
                let association = associationList
                    .filter((item) => item != 'wasteMeterAssociation')
                    .map((associationGroup) => {
                        let { meters } =
                            meterPropertyAssociationList[`${associationGroup}`];
                        let { propertyRepresentation } =
                            meterPropertyAssociationList[`${associationGroup}`];
                        let meterId = Array.isArray(meters.meterId)
                            ? meters.meterId
                            : [meters.meterId];

                        return {
                            propertyId,
                            associationGroup,
                            meterId,
                            propertyRepresentation:
                                propertyRepresentation.propertyRepresentationType,
                        };
                    });

                let meterIdList = [];

                association.forEach((item) => {
                    item['meterId'].forEach((id) => {
                        meterIdList.push({
                            id,
                            associationGroup: item.associationGroup,
                            propertyRepresentation: item.propertyRepresentation,
                            propertyId: item.propertyId,
                        });
                    });
                }); 

                let meterObjList = meterIdList.map(item => {
                    return axios
                        .get(BASE_URL + `/meter/${item.id}`, config)
                        .then((xml) => parser.toJson(xml.data, options))
                        .then(meterData => {
                            let { meter } = meterData
                            let meterObj = {
                                id: item.id,
                                name: meter.name,
                                type: meter.type,
                                associationGroup: item.associationGroup,
                                unitOfMeasure: meter.unitOfMeasure,
                                metered: meter.metered,
                                firstBillDate: meter.firstBillDate,
                                inUse: meter.inUse,
                                accessLevel: meter.accessLevel,
                                propertyRepresentation:
                                    item.propertyRepresentation,
                                PropertyId: item.propertyId,
                            };

                            Meter.updateOrCreate(meterObj);
                            return meterObj;

                        })
                        .catch(error => {
                            // console.log(`${item.id}--> ${error.message}`)

                            const errorObj = {
                                errorMsg: error.message,
                                meter_id: item.id,
                                property_id: item.propertyId,
                            };
                            Error.updateOrCreate(errorObj);

                            return errorObj;
                        })
                });

                let results = await Promise.all(meterObjList);
                res.send(results);
            });
        
	} catch (error) {
		console.log(error);
	}
});

router.get('/', (req, res, next) => {
	Meter.findAll()
		.then((meter) => res.send(meter))
		.catch(next);
});

module.exports = router;
