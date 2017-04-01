var Sequelize = require('sequelize');
var sequelize = new Sequelize('sqlite:///florin.db');

var Account = sequelize.define('account', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: Sequelize.STRING,
    type: Sequelize.STRING
});

sequelize.sync({force: true})

module.exports = {
    'Account': Account,
    'sequelize': sequelize,
    'Sequelize': Sequelize
}