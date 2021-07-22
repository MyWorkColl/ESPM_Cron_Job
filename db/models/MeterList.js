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
            meterAssociation: {
                type: DataTypes.STRING,
                field: "meterAssociation"
            },
			propertyRepresentation: {
				type: DataTypes.STRING ,
				field: "propertyRepresentation"
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