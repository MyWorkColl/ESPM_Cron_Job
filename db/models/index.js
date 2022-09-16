const Property = require('./Property')
const Meter = require('./Meter')
const Usage = require('./Usage')
const Score = require('./Score')

// Relationships
Property.hasMany(Meter)
Meter.belongsTo(Property)

Meter.hasMany(Usage)
Usage.belongsTo(Meter)

Property.hasMany(Usage)
Usage.belongsTo(Property)

Property.hasMany(Score)
Score.belongsTo(Property)



module.exports = {
    Property,
    Meter,
    Usage
}