"use strict";
const connection = require('../connection');
const { Sequelize} = connection;
const { INTEGER, STRING, DATEONLY } = Sequelize;

const Meter = connection.define(
	'Meter',
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
			allowNull: true,
		},
		associationGroup: {
			type: STRING,
			field: 'associationGroup',
			allowNull: true,
		},
		unitOfMeasure: {
			type: STRING,
			field: 'unitOfMeasure',
			allowNull: true,
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
		propertyRepresentation: {
			type: STRING,
			field: 'propertyRepresentation',
		},
	},
	{
		schema: 'ESPM',
		timestamps: true,
	}
);

Meter.updateOrCreate = function (meter) {
	const where = { id: meter.id };

	return Meter.findOne({
		where,
	}).then((found) => {
		if (!found) {
			return Meter.create(meter);
		}
		return Meter.update(meter, { where });
	});
};

Meter.getIdList = async function () {
	const list = await Meter.findAll();
	return list.map((item) => item.id);
};

module.exports = Meter;
