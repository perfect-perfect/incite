const router = require('express').Router();
// Why did we include the 'User' as well?
//  - in a query to the 'post' table, we would like to retrieve not only information about each post, but also the user that posted it
const { Post, User, Votepost } = require('../../models');
// in order to the upvote route so that when we vote on a post
//  - we receive the post's updated info
//  - we have to call on special Sequelize functionality  'sequelize.literal' so we hae to inpirt sequelize here
const sequelize = require('../../config/connection');

// GET all posts /api/posts/
router.get('/', (req, res) => {
    console.log('==============');
    Post.findAll({
        attributes: [
            'id', 
            'title', 
            'question', 
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM votepost WHERE post.id = votepost.post_id)'),'vote_count']
        ],
        // get posts in descending order (newest first)
        // notice 'order' is a nested array
        order: [['created_at', 'DESC']],
        // 'include' is how we make a 'JOIN' in sequelize
        include: [
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
        include: [
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
router.post('/', (req, res) => {
    // expects {title: 'How can I X?', question: 'I am trying to X, but I am having some issues with Y', user_id: 1 }
    Post.create({
        title: req.body.title,
        question: req.body.question,
        user_id: req.body.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// PUT /api/posts/upvote
// make sure this is before PUT '/:id' or express.js will think the word 'upvote' is a valid parameter for '/:id'
// Will differ from other PUT requests
//  - it will have two queries
//      - uing the 'Votepost' model to create a vote
//      - querying on that post to get an updated vote count
router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Votepost })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// PUT update title /api/posts/:id
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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