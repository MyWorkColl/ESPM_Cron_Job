"use strict";

module.exports = (sequelize, DataTypes) => {
	const Usage = sequelize.define(
		"Usages",
		{
			// This is the meter id
            id: {
				type: DataTypes.INTEGER,
                field: "id",
                primaryKey: true
            },
            estimatedValue: {
                type: DataTypes.BOOLEAN,
                field: "estimatedValue"
            },
			startDate: {
				type: DataTypes.DATEONLY ,
				field: "startDate"
			},
			endDate: {
				type: DataTypes.DATEONLY ,
				field: "endDate"
            },
            usage: {
                type: DataTypes.INTEGER,
                field: "usage",
                allowNull: false,
            }
		},
		{
			timestamps: true,
			createdAt: "createdDate",
			updatedAt: "modifiedDate"
		}
	);

	Usage.createUsage = async usage => {
		return await Usage.create(usage)
			.then(usage => usage)
			.catch(err => undefined);
	};

	return Usage;
};