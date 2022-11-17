'use strict';

const connection = require('../connection');
const { Sequelize } = connection;
const { INTEGER, STRING } = Sequelize;

const Error = connection.define(
	'Error',
	{
		id: {
			type: INTEGER,
			autoIncrement: true,
			field: 'id',
			primaryKey: true,
		},
		errorMsg: {
			type: STRING,
			field: 'errorMsg',
		},
		meter_id: {
			type: STRING,
			field: 'meter_id',
			allowNull: true,
		},
		property_id: {
			type: STRING,
			field: 'property_id',
			allowNull: true,
		},
	},
	{
		schema: 'ESPM',
		timestamps: true,
	}
);

Error.updateOrCreate = function (errObj) {
	let { property_id, meter_id, errorMsg } = errObj;
	let where = { property_id, meter_id, errorMsg };

	return Error.findOne({
		where,
	}).then((found) => {
		if (!found) {
			return Error.create(errObj);
		}
		return Error.update(errObj, { where });
	});
};
module.exports = Error;
