const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// extends sequelize 'Model' to the 'Answer' model
class Answer extends Model {}

// create fields/columns and configuration for Answer Model
Answer.init(
    {
        // columns will go here
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        answer_text: {
            type: DataTypes.STRING(4000),
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