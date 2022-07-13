const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// This is a through table
class Voteanswer extends Model {}

Voteanswer.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        answer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'answer',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'voteanswer'
    }
);

module.exports = Voteanswer;