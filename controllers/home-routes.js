const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Answer } = require('../models')

router.get('/', (req, res) => {
    // console.log the express-session/cookie variables
    // this console.log shows up in the terminal
    console.log(req.session);
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
            // we use '.render()' to specify which template we want to use
            // in this case we want 'homepage.handlebars'
            res.render('homepage', { posts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


router.get('/login', (req, res) => {
    // check for an express-session/cookie (if you're logged in) if one exists then reroute to the hoepage since you are already logged in
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    // our 'login.handlebars' doesn't need any variables so we don't need to pass a second argument to the 'render()' method
    res.render('login');
})

module.exports = router;