const express = require('express');
const axios = require('axios');
const { Property } = require('../db/models');
require('dotenv').config();

const router = express.Router();
router.use(express.json());

const { ESPM_USERNAME, ESPM_PW, ESPM_BASE_URL } = process.env
const auth = { 'username': ESPM_USERNAME, 'password': ESPM_PW}

const xml = '<?xml version="1.0" encoding="UTF-8"?><response status="Ok"><links><link id="86" httpMethod="GET" link="/building/86" linkDescription="This is the GET url for this Building." hint="ACME Convenience Store"/>'
+'<link id="34" httpMethod="GET" link="/building/34" linkDescription="This is the GET url for this Building." hint="ACME Grocery"/></links></response>'

let json_res = '';
let json_obj = '';


const parseString = require('xml2js').parseString;

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

async function getProperty() {
  return (await axios.get(ESPM_BASE_URL + `/account`, {
    headers: {
      'content-type': 'application/xml'
    },
    auth 
  })).data
}
    
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


router.post('/', (req, res, next) => {
  getProperty()
  .then(xml => {
    
    let json_res = '';
    let json_obj = '';
    
    parseString(xml, function (err, result) {
      json_res = JSON.stringify(result, null, 2)
      json_obj = JSON.parse(json_res)
    })
    res.send(json_obj.account)
  })
  .catch(err => console.log(err))
});

module.exports = router;