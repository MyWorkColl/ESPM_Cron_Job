"use strict";

module.exports = (sequelize, DataTypes) => {
	const MeterInfo = sequelize.define(
		"MeterInfo",
        {
            // This is the meter id
            id: {
				type: DataTypes.INTEGER,
                field: "id", 
                primaryKey: true
			},
			type: {
				type: DataTypes.STRING,
                field: "type",
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                field: "name",
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

	MeterInfo.createMeterInfo = async meterInfo => {
		return await MeterInfo.create(meterInfo)
			.then(meterInfo => meterInfo)
			.catch(err => undefined);
	};

	return MeterInfo;
};