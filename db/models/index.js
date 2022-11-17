const Property = require('./Property')
const Meter = require('./Meter')
const Usage = require('./Usage')
const Score = require('./Score')
const Error = require('./Error')

// Relationships
Property.hasMany(Meter);
Meter.belongsTo(Property);

Meter.hasMany(Usage);
Usage.belongsTo(Meter);

Property.hasMany(Usage);
Usage.belongsTo(Property);

Property.hasMany(Score);
Score.belongsTo(Property);

// Property.hasMany(Error, {
//     foreignKey: {
//         allowNull: true
//     }
// });
// Error.belongsTo(Property);

// Meter.hasMany(Error, {
//     foreignKey: {
//         allowNull: true
//     }
// });
// Error.belongsTo(Meter);

module.exports = {
    Property,
    Meter,
    Usage,
    Score,
    Error
}