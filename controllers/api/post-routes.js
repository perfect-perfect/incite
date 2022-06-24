const router = require('express').Router();
// Why did we include the 'User' as well?
//  - in a query to the 'post' table, we would like to retrieve not only information about each post, but also the user that posted it
const { Post, User, Votepost, Answer, Voteanswer } = require('../../models');
// in order to the upvote route so that when we vote on a post
//  - we receive the post's updated info
//  - we have to call on special Sequelize functionality  'sequelize.literal' so we hae to inpirt sequelize here
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require ('dotenv').config();
const path = require('path');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Image',
    }
});

const upload = multer({ storage: storage });

// GET all posts /api/posts/
router.get('/', (req, res) => {
    console.log('==============');
    Post.findAll({
        attributes: [
            'id', 
            'title', 
            'question',
            'image', 
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM votepost WHERE post.id = votepost.post_id)'),'vote_count']
        ],
        // get posts in descending order (newest first)
        // notice 'order' is a nested array
        order: [[sequelize.literal('`vote_count` DESC')]],
        // 'include' is how we make a 'JOIN' in sequelize
        include: [
            // include the Answer model
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
            'image', 
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
                },

            },
            {
                model: Answer,
                include: {
                    model: Voteanswer,
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
router.post('/', withAuth, upload.single('postImage'), (req, res) => {
    // res.redirect('/dashboard')
    // expects {title: 'How can I X?', question: 'I am trying to X, but I am having some issues with Y', user_id: 1 }
    Post.create({
        title: req.body.title,
        question: req.body.question,
        user_id: req.session.user_id,
        image: req.file.path
    })
        // .then(dbPostData => {
        //     res.json(dbPostData);
        // })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    res.redirect('/dashboard');
    location.reload();
});

// PUT /api/posts/upvote
// make sure this is before PUT '/:id' or express.js will think the word 'upvote' is a valid parameter for '/:id'
// Will differ from other PUT requests
//  - it will have two queries
//      - uing the 'Votepost' model to create a vote
//      - querying on that post to get an updated vote count
router.put('/upvote', withAuth, (req, res) => {
    // make sure the session exists first, before even touching the database
    if (req.session) {
        // pass session id along with all destructured properties on req.body
        //  - What are the destructured properties on 'req.body'
        //      - i believe it is post_id: id from the upvote.js static js file that responds to the clicking of the upvote button
        // 'upvote()' is a custom static method created in models/Post.js
        // console.log(...req.body)
        Post.upvote(
            { 
                ...req.body,
                // make sit so the upvote feature wil only work if someone has logged in
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
            title: req.body.title
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

// DELETE a post /api/posts/:id
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