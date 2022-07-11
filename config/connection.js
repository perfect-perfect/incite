// import the Sequelize contructor 
const Sequelize = require('sequelize');

require('dotenv').config();

let sequelize;

// connects sequelize to either local environment database or heroku database
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    });
}

// export sequelize so we can import it anywhere throughout the application
module.exports = sequelize;