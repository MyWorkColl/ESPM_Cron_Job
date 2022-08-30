"use strict";

const connection = require("../connection");
const { Sequelize } = connection;
const { DECIMAL, DATEONLY, BOOLEAN, STRING } = Sequelize;

const Usage = connection.define(
	'Usage',
	{
		// This is the meter id
		id: {
			type: STRING,
			field: 'id',
			primaryKey: true,
		},
		estimatedValue: {
			type: BOOLEAN,
			field: 'estimatedValue',
		},
		cost: {
			type: STRING,
			field: 'cost',
		},
		startDate: {
			type: DATEONLY,
			field: 'startDate',
		},
		endDate: {
			type: DATEONLY,
			field: 'endDate',
		},
		usage: {
			type: STRING,
			field: 'usage',
		},
	},
	{
		schema: 'ESPM',
		timestamps: true,
	}
);

Usage.updateOrCreate = function (usage) {
	const where = { id: usage.id };

	return Usage.findOne({
		where,
	}).then((found) => {
		if (!found) {
			return Usage.create(usage);
		}
		return Usage.update(usage, { where });
	});
};

Usage.getIdList = async function () {
	const list = await Usage.findAll();
	return list.map((item) => item.id);
};

module.exports = Usage