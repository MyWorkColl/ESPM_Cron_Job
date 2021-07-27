"use strict";

const connection = require('../connection');
const { Sequelize } = connection;
const { INTEGER, STRING, BOOLEAN, FLOAT } = Sequelize;

const Property = connection.define(
	'Property',
	{
		// This is property id
		id: {
			type: INTEGER,
			field: 'id',
			primaryKey: true,
		},
		name: {
			type: STRING,
			field: 'name',
		},
		streetAddress: {
			type: STRING,
			field: 'streetAddress',
		},
		city: {
			type: STRING,
			field: 'city',
		},
		state: {
			type: STRING,
			field: 'state',
		},
		postalCode: {
			type: STRING,
			field: 'postalCode',
		},
		country: {
			type: STRING,
			field: 'country',
		},
		numberOfBuildings: {
			type: INTEGER,
			field: 'numberOfBuildings',
		},
		yearBuilt: {
			type: STRING,
			field: 'yearBuilt',
		},
		grossFloorArea: {
			type: FLOAT,
			field: 'grossFloorArea',
		},
		grossFloorAreaUnits: {
			type: STRING,
			field: 'grossFloorAreaUnits',
		},
		occupancyPercentage: {
			type: FLOAT,
			field: 'occupancyPercentage',
		},
		isFederalProperty: {
			type: BOOLEAN,
			field: 'isFederalProperty',
		},
		isInstitutionalProperty: {
			type: BOOLEAN,
			field: 'isInstitutionalProperty',
		},
		notes: {
			type: STRING,
			field: 'notes',
		},
	},
	{
		schema: 'ESPM',
		timestamps: true,
	}
);

Property.createProperty = function (property) {
	return Property.findOrCreate({
		where: { id: Property.id },
		defaults: Property
	})
};

module.exports = Property