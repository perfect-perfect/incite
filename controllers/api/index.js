const router = require('express').Router();

// assign api routes a constant
const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');
const answerRoutes = require('./answer-routes');

// adds prefixes to the routes
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/answers', answerRoutes);

module.exports = router;