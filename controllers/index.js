const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes')
const dashboardRoutes = require('./dashboard-routes')

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
// all dashboard views will be prefixed with '/dashboard'
router.use('/dashboard', dashboardRoutes);

// any request made to an endpoint that doesn't exist will receive a 404
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;