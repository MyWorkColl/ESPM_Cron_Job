const Property = require('./Property')
const Meter = require('./Meter')
const Usage = require('./Usage')

// Relationships
Property.hasMany(Meter)
Meter.belongsTo(Property)

Meter.hasMany(Usage)
Usage.belongsTo(Meter)

module.exports = {
    Property,
    Meter,
    Usage
}