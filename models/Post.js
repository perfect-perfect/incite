const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post Model
// we had to combine 'Votepost.create()' with 'Post.findOne()' in the upvote route. we will use model method instances to replace that messy code
class Post extends Model {
    // we're using 'static' keyword to indicate that the 'upvote' method is one that's based on the 'Post' model
    // we;ve set it up so that we can now execute 'Post.upvote()' as if it where one of Sequelize's other built in methods
    //  - we'll pass in the value of 'req.body' (as body) and an object of the models (as 'models') as parameters
    static upvote(body, models) {
        // almost exactly the same code we implemented into the PUT route
        // the onlu difference is that we'lre using 'models.Votepost'
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
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
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