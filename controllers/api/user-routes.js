// express.js router
const router = require('express').Router();
const { User, Post, Votepost, Answer } = require('../../models');
// withAuth is middleware that protects the path from user's who are not logged in.
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');

// import Cloudinary
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require ('dotenv').config();
// import path
const path = require('path');
// import multer
const multer = require('multer');

// set up connection to cloudinary
cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
})

// set cloudinary as the storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatars',
    }
});

// have multer use the cloudinary storage
const upload = multer({ storage: storage });

// Get all users /api/users
router.get('/', (req, res) => {
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


// GET one user /api/users/:id
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

// POST a user /api/users
router.post('/', (req, res) => {
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
            res.status(500).json(err);
        });
});

// POST an avatar image /api/users/avatar
// notice we used 'upload.single()' to upload to use multer to upload to cloudinary
router.post('/avatar', upload.single('avatar'), (req, res) => {
    User.update(
        {
            avatar: req.file.path
        },
        {
            where: {
                id: req.session.user_id
            }
        }

    )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json(err)
            }
            res.redirect('/dashboard');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
})

// POST login /api/users/login
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

            // Verify password
            const validPassword = dbUserData.checkPassword(req.body.password);
            if (!validPassword) {
                res.status(400).json({ message: 'Incorrect password!' });
                return;
            }
            // we can finally log in users and then allow them to comment on and upvote posts.
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
router.post('/logout', withAuth, (req, res) => {
    if (req.session.loggedIn) {
        // use 'destroy()' method to clear the express-session/cookie if we are logged in
        req.session.destroy(() => {
            // send 204 status code after session has successfully ben destroyed
            res.status(204).end();
        });
    }
    else {
        res.status(404).end()
    }
})

// PUT update password /api/users/1
router.put('/:id', withAuth, (req, res) => {
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

// DELETE by :id /api/users/1
router.delete('/:id', withAuth, (req, res) => {
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