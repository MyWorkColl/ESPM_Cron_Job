const Sequelize = require("sequelize");
const { Property, MeterList, MeterInfo, Usage } = require("./models/")

require("dotenv").config();

const {
	SQLAZURECONNSTR_DB_HOST,
	SQLAZURECONNSTR_DB_USER,
	SQLAZURECONNSTR_DB_PW,
	SQLAZURECONNSTR_DB_NAME
} = process.env;

const db = {};

const sequelize = new Sequelize(
	SQLAZURECONNSTR_DB_NAME,
	SQLAZURECONNSTR_DB_USER,
	SQLAZURECONNSTR_DB_PW,
	{
		host: SQLAZURECONNSTR_DB_HOST,
		dialect: "mssql",
		dialectOptions: { options: { encrypt: true } }
	}
);

sequelize.getQueryInterface().showAllTables().then(function (tables) {
	ESPM_tables = tables.filter(table => table.schema == 'ESPM' )
    console.log(ESPM_tables);
});

Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
	return this._applyTimezone(date, options).format("YYYY-MM-DD HH:mm:ss.SSS");
};

// db.Property = sequelize.import(Property);
// db.MeterList = sequelize.import(MeterList);
// db.MeterInfo = sequelize.import(yMeterInfo);
// db.Usage = sequelize.import(Usage);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db