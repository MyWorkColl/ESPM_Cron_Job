const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const { Connection } = require('tedious');
require("dotenv").config();

const {
	SQLAZURECONNSTR_DB_HOST,
	SQLAZURECONNSTR_DB_USER,
	SQLAZURECONNSTR_DB_PW,
	SQLAZURECONNSTR_DB_NAME
} = process.env;

const connection = new Sequelize(
	SQLAZURECONNSTR_DB_NAME,
	SQLAZURECONNSTR_DB_USER,
	SQLAZURECONNSTR_DB_PW,
	{
		host: SQLAZURECONNSTR_DB_HOST,
		dialect: 'mssql',
		dialectOptions: { options: { encrypt: true } },
	}
);

connection.getQueryInterface().showAllTables().then(function (tables) {
	ESPM_tables = tables.filter(table => table.schema == 'ESPM' )
	// ESPM_tables = tables
    console.log(ESPM_tables);
});

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
	return this._applyTimezone(date, options).format("YYYY-MM-DD HH:mm:ss");
};

Connection.Sequelize = Sequelize

// // Testing the connection
// try {
//     connection.authenticate();
//     console.log('Connection has been successfully established')
// } catch (error) {
//     console.error('Unable to connect to the database:', error)
// }


// // // Testing the connection
// connection.authenticate()
//     .then(() => console.log('Connection has been successfully established'))
//     .catch(error =>
//         console.error('Unable to connect to the database:', error)
//     )

    
module.exports = connection


