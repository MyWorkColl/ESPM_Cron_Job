"use strict";

module.exports = (sequelize, DataTypes) => {
	const Account = sequelize.define(
		"Accounts",
		{
			accountId: {
				type: DataTypes.INTEGER,
				field: "accountId"
			},
			username: {
				type: DataTypes.STRING,
				field: "username"
			},
			email: {
				type: DataTypes.STRING,
				field: "email"
			}
		},
		{
			timestamps: true,
			createdAt: "createdDate",
			updatedAt: "modifiedDate"
		}
	);

	Account.findByEmail = async email => {
		return await Account.findOne({ where: { email } })
			.then(account => (account ? account : undefined))
			.catch(err => undefined);
	};

	Account.createAccount = async account => {
		return await Account.create(account)
			.then(account => account)
			.catch(err => undefined);
	};

	Account.deleteAccount = async email => {
		return await Account.destroy({
			where: { email: email }
		})
			.then(num => (num == 1 ? true : false))
			.catch(err => false);
	};

	Account.updateAccount = async (email, data) => {
		return await Account.update(data, { where: { email } })
			.then(account => account)
			.catch(err => undefined);
	};

	return Account;
};