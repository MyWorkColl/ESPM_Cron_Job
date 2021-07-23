"use strict";

module.exports = (sequelize, DataTypes) => {
	const Property = sequelize.define(
		"Properties",
		{
			// This is property id
            id: {
				type: DataTypes.INTEGER,
                field: "id",
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                field: "name"
            },
			streetAddress: {
				type: DataTypes.STRING ,
				field: "streetAddress"
            },
			city: {
				type: DataTypes.STRING ,
				field: "city"
            },
			state: {
				type: DataTypes.STRING ,
				field: "state"
			},
			postalCode: {
				type: DataTypes.STRING ,
				field: "postalCode"
			},
			country: {
				type: DataTypes.STRING ,
				field: "country"
			},
			numberOfBuildings: {
				type: DataTypes.INTEGER ,
				field: "numberOfBuildings"
			},
			yearBuilt: {
				type: DataTypes.STRING ,
				field: "yearBuilt"
			},
			grossFloorArea : {
				type: DataTypes.FLOAT ,
				field: "grossFloorArea"
			},
			grossFloorAreaUnits: {
				type: DataTypes.STRING ,
				field: "grossFloorAreaUnits"
			},
			occupancyPercentage: {
				type: DataTypes.FLOAT,
				field: "occupancyPercentage"
			},
			isFederalProperty: {
				type: DataTypes.BOOLEAN ,
				field: "isFederalProperty"
			},
			isInstitutionalProperty: {
				type: DataTypes.BOOLEAN ,
				field: "isInstitutionalProperty"
			},
			notes: {
				type: DataTypes.STRING ,
				field: "notes"
			}
		},
		{
			timestamps: true,
			createdAt: "createdDate",
			updatedAt: "modifiedDate"
		}
	);

	Property.createProperty = async property => {
		return await Property.create(property)
			.then(property => property)
			.catch(err => undefined);
	};

	return Property;
};