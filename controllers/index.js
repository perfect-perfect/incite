const router = require('express').Router();

// brings in routes
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes')
const dashboardRoutes = require('./dashboard-routes')

// prefixes routes
router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

// any request made to an endpoint that doesn't exist will receive a 404
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;