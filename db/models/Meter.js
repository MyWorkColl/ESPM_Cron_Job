"use strict";
const connection = require('../connection');
const { Sequelize} = connection;
const { INTEGER, STRING, DATEONLY } = Sequelize;

const Meter = connection.define(
	'meter',
	{
		// This is the meter id
		id: {
			type: INTEGER,
			field: 'id',
			primaryKey: true,
		},
		name: {
			type: STRING,
			field: 'name',
		},
		type: {
			type: STRING,
			field: 'type',
			allowNull: false,
		},
		associationGroup: {
			type: STRING,
			field: 'type',
			allowNull: false,
		},
		unitOfMeasure: {
			type: STRING,
			field: 'unitOfMeasure',
			allowNull: false,
		},
		metered: {
			type: STRING,
			field: 'metered',
		},
		firstBillDate: {
			type: DATEONLY,
			field: 'firstBillDate',
		},
		inUse: {
			type: STRING,
			field: 'inUse',
		},
		accessLevel: {
			type: STRING,
			field: 'accessLevel',
		},
	},
	{
		
		schema: 'ESPM',
		timestamps: true,
	}
);

module.exports = Meter;
