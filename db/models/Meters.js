"use strict";

module.exports = (sequelize, DataTypes) => {
	const MeterList = sequelize.define(
		"MeterLists",
		{
			// This is the meter id
            id: {
				type: DataTypes.INTEGER,
                field: "id",
                allowNull: false,
			},
            name: {
                type: DataTypes.STRING,
                field: "name"
            },
			type: {
				type: DataTypes.STRING,
                field: "type",
                allowNull: false,
            },
            unitOfMeasure: {
                type: DataTypes.STRING,
                field: "unitOfMeasure",
                allowNull: false,
            },
            metered: {
                type: DataTypes.STRING,
                field: "metered"
            },
			firstBillDate: {
				type: DataTypes.DATEONLY ,
				field: "firstBillDate"
			},
			inUse: {
				type: DataTypes.STRING ,
				field: "inUse"
            },
            accessLevel: {
                type: DataTypes.STRING,
                field: "accessLevel"
            }
		},
		{
			timestamps: true,
			createdAt: "createdDate",
			updatedAt: "modifiedDate"
		}
	);

	MeterList.createMeterList = async meterList => {
		return await MeterList.create(meterList)
			.then(meterList => meterList)
			.catch(err => undefined);
	};

	return MeterList;
};