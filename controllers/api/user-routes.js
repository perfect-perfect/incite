// express.js router
const router = require('express').Router();
const { User, Post, Votepost, Answer } = require('../../models');

// Get /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method
    User.findAll({
        // an object with an array in side, so if we decide to exclude other information we simply add it to the array '[]'
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            // include all the user's posts
            {
                model: Post,
                attributes: ['id', 'title', 'question', 'created_at']
            },
            // including the 'Post' model on the 'Answer' model so we can see on which posts this user commented
            {
                model: Answer,
                attributes: ['id', 'answer_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            // include the titles of all the posts a user has voted on
            {
                // interesting that we use model: Post here first, and then use the through: Votepost
                model: Post,
                attributes: ['title'],
                through: Votepost,
                as: 'voted_posts'
            }

        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => {
            // creates the express-session/cookie
            // gives our server easy access to the user's 'user_id', 'username', and a Boolean describing whether or not the user is logged in.
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST login /api/users/login
// POST carries the request in the 'req.body' which is more secure then a GET request which carries it in the parameter (url)
router.post('/login', (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    // Query the 'User' table for the email entered by the user and assigned it to to req.body.email
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then (dbUserData => {
            if (!dbUserData) {
                res.status(400).json({ message: 'No user with that email address!' });
                return;
            }

            // Verify user
            const validPassword = dbUserData.checkPassword(req.body.password);
            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect password!' });
                return;
            }

            req.session.save(() => {
                // declare session variables
                // creates the express-session/cookie
                // gives our server easy access to the user's 'user_id', 'username', and a Boolean describing whether or not the user is logged in.
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json({ user: dbUserData, message: 'You are now logged in!' });
            });

        });
});

// POST logout to /api/users/logout
router.post('/logout', (req, res) => {
    // use 'destroy()' method to clear the express-session/cookie if we are logged in
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            // send 204 status code after session has successfully ben destroyed
            res.status(204).end();
        });
    }
    else {
        res.status(404).end()
    }
})

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

module.exports = router;