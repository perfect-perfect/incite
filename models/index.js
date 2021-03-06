// import User model
const User = require('./User');
const Post = require('./Post');
const Answer = require('./Answer')
const Votepost = require('./Votepost');
const Voteanswer = require('./Voteanswer');

// Model associations

// BEGIN USER AND POST ASSOCIATIONS
// ONE-TO-MANY relationship
// Creates the reference for the 'id' column in the 'User' model to link to the corresponding foreign key pair, which is the 'user_id' in the 'Post' model.
User.hasMany(Post, {
    foreignKey: 'user_id'
})

// Reverse association 
// POST BELONGS TO ONE USER, BUT NOT MANY USERS
Post.belongsTo(User, {
    // again we declare the link to the foreign key. 'user_id' in the 'Post' model
    foreignKey: 'user_id',
})
// END USER AND POST ASSOCIATIONS

// BEGIN VOTEPOST ASSOCIATIONS
// We need to associate 'User' and 'Post' to one another in a way that when we query 'Post', we can see a total of how many votes a user creates and when we query 'User' we can see all of the posts they've voted on
// '.belongsToMany()'
//  - we're allowing both the 'User' and 'Post' models to query each other's information in the context of a vote
//      - if we want to see which users voted on a single post, we can now do that
//      - if we want to see which posts a single user voted on, we can see that too
User.belongsToMany(Post, {
    // we instruct that 'User' and 'Post' modles will be connected, but 'through' the 'Votepost' model
    through: Votepost,
    // the name of the 'Votepost' model should be displayed as 'voted_posts' when queried
    as: 'voted_posts',
    // we want to the foreignKey to be in 'Votepost'
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Votepost,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// if we want to see the total number of votes on a post
//  - we need to directly connect the 'Post' and 'Votepost' models
Votepost.belongsTo(User, {
    foreignKey: 'user_id'
});

Votepost.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Votepost, {
    foreignKey: 'user_id'
});

Post.hasMany(Votepost, { 
    foreignKey: 'post_id'
})
// END VOTEPOST ASSOCIATIONS

// BEGIN ANSWER ASSOCIATIONS
Answer.belongsTo(User, {
    foreignKey: 'user_id'
});

Answer.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Answer, {
    foreignKey: 'user_id'
});

Post.hasMany(Answer, {
    foreignKey: 'post_id'
});
// END ANSWER ASSOCIATIONS

// BEGIN VOTEANSWER ASSOCIATIONS
User.belongsToMany(Answer, {
    through: Voteanswer,
    as: 'voted_answer',
    foreignKey: 'user_id'
});

Answer.belongsToMany(User, {
    through: Voteanswer,
    as: 'voted_answer',
    foreignKey: 'answer_id'
})

// link 'Answer' and 'Voteanswer' so we can see the total number of votes on an answer
Voteanswer.belongsTo(User, {
    foreignKey: 'user_id'
});

Voteanswer.belongsTo(Answer, {
    foreignKey: 'answer_id'
});

User.hasMany(Voteanswer, {
    foreignKey: 'user_id'
});

Answer.hasMany(Voteanswer, {
    foreignKey: 'answer_id'
})
// END VOTEANSWER ASSOCIATIONS

// export models
module.exports = { User, Post, Votepost, Answer, Voteanswer };