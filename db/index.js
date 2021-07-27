const connection = require("./connection")
const models = require("./models/")

const sync = async (force = false) => {
	await connection.sync({ force })
}

module.exports = {
	models,
	sync
}
