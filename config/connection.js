// import the Sequelize contructor 
const Sequelize = require('sequelize');

require('dotenv').config();

// was in cloudinary tutorial
const cloudinary = require('cloudinary').v2;

console.log(cloudinary.config().cloud_name);
console.log(cloudinary.config().api_key);
console.log(cloudinary.config().api_secret)

// create connection to our database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;