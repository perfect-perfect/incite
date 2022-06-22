const express = require('express');
const routes = require('./controllers');
// importing the connection to Sequelize
const sequelize = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const helpers = require('./utils/helpers')

// upload images
const upload = require('./uploads/multer');

const cloudinary = require('./uploads/cloudinary')

const fs = require('fs');


// set up handlebars as template engine
const exphbs = require('express-handlebars');
// we're letting handlebars know about the helpers file
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// code for 'express-session' for login and cookies
// sets up an Express.js session and connects the session to our Sequelize database
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
    secret: 'Super secret secret',
    // and empty objext here tells our session to use cookies
    // this is where we would add additional options to the cookiem like max age.
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};
app.use(session(sess));

// turn on routes
app.use(routes);

// turn on connection to db and server
// change force to 'true' to sync model definitions and associations if there have been any changes.
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});