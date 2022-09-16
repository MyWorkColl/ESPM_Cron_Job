"use strict";

const connection = require('../connection');
const { Sequelize } = connection;
const { INTEGER, STRING, FLOAT } = Sequelize;

const Score = connection.define(
	'Score',
	{
		id: {
			type: INTEGER,
			autoIncrement: true,
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
		},
	},
	{
		schema: 'ESPM',
		timestamps: true,
	}
);

Score.updateOrCreate = function (metric) {
	let {PropertyId, endingYear, endingMonth, name} = metric
	let where = { PropertyId, endingYear, endingMonth, name };

	return Score.findOne({
		where
	})
	.then(found => {
		if (!found) {
			return Score.create(metric)
		}
		return Score.update(metric, {where})
	})
};

module.exports = Score