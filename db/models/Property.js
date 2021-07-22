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
            link: {
                type: DataTypes.STRING,
                field: "link"
            },
			linkDescription: {
				type: DataTypes.STRING ,
				field: "linkDescription"
			},
			propertyName: {
				type: DataTypes.STRING ,
				field: "propertyName"
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