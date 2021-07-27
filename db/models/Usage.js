"use strict";

const connection = require("../connection");
const { Sequelize } = connection;
const { INTEGER, DATEONLY, BOOLEAN } = Sequelize;

const Usage = connection.define(
	"Usage",													
	{
		// This is the meter id
		id: {
			type: INTEGER,
			field: "id",
			primaryKey: true
		},
		estimatedValue: {
			type: BOOLEAN,
			field: "estimatedValue"
		},
		startDate: {
			type: DATEONLY ,
			field: "startDate"
		},
		endDate: {
			type: DATEONLY ,
			field: "endDate"
		},
		usage: {
			type: INTEGER,
			field: "usage",
			allowNull: false,
		}
	},
	{
		schema : 'ESPM' ,
		timestamps: true
	}					
);
module.exports = Usage