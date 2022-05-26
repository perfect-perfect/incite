const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post Model
class Post extends Model {}

// create fields/columns for Post Model
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            // using the 'references' property, we established a relationship between this post and the user by creating a reference to the 'User' model
            //  - specifically to the 'id' column that is defined by the 'key' property
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;