const router = require('express').Router();

const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');
const answerRoutes = require('./answer-routes');

// adds prefixes to the routes, makes it easier to scale up
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/answers', answerRoutes);

module.exports = router;