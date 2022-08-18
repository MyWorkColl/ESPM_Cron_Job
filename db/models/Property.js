"use strict";

const connection = require('../connection');
const { Sequelize } = connection;
const { INTEGER, STRING, BOOLEAN, FLOAT, TEXT } = Sequelize;

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
		notes: {
			type: TEXT,
			field: 'notes',
		},
	},
	{
		schema: 'ESPM',
		timestamps: true,
	}
);

Property.updateOrCreate = function (property) {
	const where = { id: property.id };

	return Property.findOne({
		where
	})
	.then(found => {
		if (!found) {
			return Property.create(property)
		}
		return Property.update(property, {where})
	})
};

Property.getIdList = async function() {
	const list = await Property.findAll()
	return list.map(item => item.id)
}

module.exports = Property