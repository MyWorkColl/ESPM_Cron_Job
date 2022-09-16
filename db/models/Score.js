"use strict";

const connection = require('../connection');
const { Sequelize } = connection;
const { STRING, FLOAT } = Sequelize;

const Score = connection.define(
	'Score',
	{
		id: {
			type: STRING,
			field: 'id',
			primaryKey: true,
		},
		// name of metrics
		name: {
			type: STRING,
			field: 'name',
		},
		// Unit of Measure (EPA)
		uom: {
			type: STRING,
			field: 'uom',
		},
		// measure ending year
		endingYear: {
			type: STRING,
			field: 'endingYear',
		},
		// measure ending month
		endingMonth: {
			type: STRING,
			field: 'endingMonth',
		},
		value: {
			type: FLOAT,
			field: 'value',
		}
	},
	{
		schema: 'ESPM',
		timestamps: true,
	}
);

// Score.updateOrCreate = function (property) {
// 	const where = { id: property.id };

// 	return Property.findOne({
// 		where
// 	})
// 	.then(found => {
// 		if (!found) {
// 			return Property.create(property)
// 		}
// 		return Property.update(property, {where})
// 	})
// };

module.exports = Score