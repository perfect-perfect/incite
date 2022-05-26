const router = require('express').Router();
// Why did we include the 'User' as well?
//  - in a query to the 'post' table, we would like to retrieve not only information about each post, but also the user that posted it
const { Post, User } = require('../../models');

// GET all posts /api/posts/
router.get('/', (req, res) => {
    console.log('==============');
    Post.findAll({
        attributes: ['id', 'title', 'question', 'created_at'],
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
        attributes: ['id', 'title', 'question', 'created_at'],
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