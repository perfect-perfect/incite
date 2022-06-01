const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Answer extends Model {}

Answer.init(
    {
        // columns will go here id, answer_text, user_id, and post_id
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        answer_text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { 
                model: 'post',
                key: 'id'
            }
        }

    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'answer'
    }
);

module.exports = Answer;