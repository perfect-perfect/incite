const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post Model
// model method instances for upvote capability. We can now execute 'Post.upvote()' as if it where one of Sequelize's other built in methods
class Post extends Model {
    static upvote(body, models) {
        // we're using 'models.Votepost'
        // we'll pass in the value of 'req.body' (as body) and an object of the models (as 'models') as parameters
        return models.Votepost.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'title',
                    'question',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM votepost WHERE post.id = votepost.post_id)'), 'vote_count'
                    ]
                ]
            });
        });
    }
}

// create fields/columns and configuration for Post Model
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
            type: DataTypes.STRING(4000),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            // established a relationship between this post and the user by creating a reference to the 'User' model
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