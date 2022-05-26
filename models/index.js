// import User model
const User = require('./User');
const Post = require('./Post')

// create model associations
// ONE-TO-MANY relationship
//  - this association creates the reference for the 'id' column in the 'User' model
//      - to link to the corresponding foreign key pair, which is the 'user_id' in the 'Post' model.
User.hasMany(Post, {
    foreignKey: 'user_id'
})

// reverse association 
// POST BELONGS TO ONE USER, BUT NOT MANY USERS
Post.belongsTo(User, {
    // again we declare the link to the foreign key
    //  - 'user_id' in the 'Post' model
    foreignKey: 'user_id',
})

// export models
module.exports = { User, Post };