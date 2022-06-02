const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Answer } = require('../models')

router.get('/', (req, res) => {
    // we use '.render()' to specify which template we want to use
    // in this case we want 'homepage.handlebars'
    Post.findAll({
        attributes: [
            'id',
            'title',
            'question',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM votepost WHERE post.id = votepost.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Answer,
                attributes: [
                    'id',
                    'answer_text',
                    'post_id',
                    'user_id',
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            // pass a single post object into the homepage template
            // we are only passing the first post 'dbPostData[0]'
            // we use '.get()' to seralize the object down to the properties we need
            // we didn't need to serialize our data before because 'res.json()' did that automatically for us
            // This will loop over and map each Sequelized object into a serialized version of itself
            //  - saving the results in a new 'posts' array
            const posts = dbPostData.map(post => post.get({ plain: true}))
            // Now we can plug that new posts array into the template
            //  - although render can accept an array instead of an object
            //      - that would prevent us from adding other properties to the template later
            //      - we can simpllu add the array to a object '{ posts }'
            //          - to loop over this array we'll have to employ handlebars 'helpers' that can loop thorugh arrays on the homepage
            res.render('homepage', { posts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;