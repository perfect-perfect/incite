// import routes
const router = require('express').Router();
// import models
const { Post, User, Votepost, Answer, Voteanswer } = require('../../models');
// import sequelize
const sequelize = require('../../config/connection');
// access to authorization
const withAuth = require('../../utils/auth');

// GET all posts /api/posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id', 
            'title', 
            'question', 
            'created_at',
            // create vote count
            [sequelize.literal('(SELECT COUNT(*) FROM votepost WHERE post.id = votepost.post_id)'),'vote_count']
        ],
        // get posts in descending order (newest first)
        order: [[sequelize.literal('`vote_count` DESC')]],
        // 'include' is how we make a 'JOIN' in sequelize
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
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET single post /api/posts/:id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id', 
            'title', 
            'question',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM votepost WHERE post.id = votepost.post_id)'), 'vote_count']
        ],
        // 'include' is how we make a 'JOIN' in sequelize
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
                },

            },
            {
                model: Answer,
                include: {
                    model: Voteanswer,
                    // create answer vote count
                    attributes: [
                        [sequelize.literal('(SELECT COUNT(*) FROM voteanswer WHERE post.id = voteanswer.post_id)'), 'answervote_count']
                    ]
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST a post /api/posts/
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        question: req.body.question,
        user_id: req.session.user_id,
    })
        .then(dbPostData => {
            res.redirect('/dashboard')
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    
});

// PUT /api/posts/upvote
// make sure this is before PUT '/:id' or express.js will think the word 'upvote' is a valid parameter for '/:id'
// Will differ from other PUT requests, has two queries.
router.put('/upvote', withAuth, (req, res) => {
    if (req.session) {
        // 'upvote()' is a custom static method created in models/Post.js
        Post.upvote(
            { 
                // destructure properties on req.body
                ...req.body,
                user_id: req.session.user_id 
            }, 
            { 
                Votepost, 
                Answer, 
                User 
            }
        )
        .then(updatedVoteData => res.json(updatedVoteData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

// PUT update title /api/posts/:id
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            question: req.body.question
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' })
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });       
});

// DELETE post /api/posts/:id
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;