const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Answer } = require('../models');
const withAuth = require('../utils/auth');

// renders the dashboard.handlebars when you go to localhost:3001/dashboard
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            // use the ID from the session
            user_id: req.session.user_id
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
                    'created_at'
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
            //serialize data before passing to template
            const posts = dbPostData.map(post => post.get({ plain: true}));
            // we'll hardcode the 'loggedIn' property as 'true' because a user won't be able to get to the dashboard unless they're logged in
            // we pass in posts which is the mapped out results of the 'Post.findAll()'
            res.render('dashboard', { posts, loggedIn: true });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    
})

router.get('/edit/:id', withAuth, (req, res) => {
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
                    'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
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
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });

            // pass data to edit-post.handlebars
            res.render('edit-post', {
                post,
                loggedIn: true
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
})

module.exports = router;