const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Answer, Voteanswer } = require('../models')

// GET all posts for the hompage '/'
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'question',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM votepost WHERE post.id = votepost.post_id)'), 'vote_count']
        ],
        order: [[sequelize.literal('`vote_count` DESC')]],
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
                include: [
                    {
                        model: User,
                        attributes: [
                            'username',
                            'avatar'
                        ]
                    }
                ]
            },
            {
                model: User,
                attributes: [
                    'username',
                    'avatar'
                ]
            }
        ]
    })
        .then(dbPostData => {
            // This will loop over and map each Sequelized object into a serialized version of itself
            //  - saving the results in a new 'posts' array
            const posts = dbPostData.map(post => post.get({ plain: true}))
            // send new posts array to homepage.handlebars
            res.render('homepage', { 
                posts,
                loggedIn: req.session.loggedIn
            });
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
    res.render('login');
});

router.get('/signup', (req, res) =>{
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
})

// GET post info for single post page
// notice that the api is different, it is 'posts'
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'question',
            'title',
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
                    'created_at',
                ],
                include: {
                    model: User,
                    attributes: [
                        'username',
                        'avatar'
                    ]
                },
            },
            {
                model: Answer,
                attributes: [
                    [sequelize.literal('(SELECT COUNT(*) FROM voteanswer WHERE answers.id = voteanswer.answer_id)'), 'answervote_count']
                ]
            },
            {
                model: User,
                attributes: [
                    'username',
                    'avatar'
                ]
            },
        ],
        order: [
            [[sequelize.literal('`answers.answervote_count` DESC')]]
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });
            // pass data to template
            res.render('single-post', { 
                post,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;