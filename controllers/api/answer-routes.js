const router = require('express').Router();
const { Answer, User, Voteanswer } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth')

router.get('/', (req, res) => {
    Answer.findAll({
        attributes: [
            'id',
            'answer_text',
            'created_at',
            [
                sequelize.literal('(SELECT COUNT(*) FROM voteanswer WHERE answer.id = voteanswer.answer_id)'), 'answervote_count'
            ]
        ],
        // want to add order here and order by vote_count
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

router.post('/', withAuth, (req, res) => {
    // check the session
    if (req.session) {
        Answer.create({
            answer_text: req.body.answer_text,
            post_id: req.body.post_id,
            // use the id from the session
            user_id: req.session.user_id
        })
            .then(dbAnswerData => res.json(dbAnswerData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }

});

// PUT api/answers/upvote
router.put('/upvote', (req, res) => {
    // use 'Voteanswer' to create a vote
    Voteanswer.create({
        // using session user id
        user_id: req.session.user_id,
        post_id: req.body.post_id,
        answer_id: req.body.answer_id
    }).then(() => {
        // find the answer we just voted on
        return Answer.findOne({
            where: {
                id: req.body.answer_id
            },
            attributes: [
                'id',
                'answer_text',
                'created_at',
                // [
                //     sequelize.literal('(SELECT COUNT(*) FROM voteanswer WHERE answer.id = voteanswer.answer_id)'), 'answervote_count'
                // ]
            ]
        })
    })
        .then(dbAnswerData => res.json(dbAnswerData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })

    // query on that Answer t get an updated vote count

});

// DELETE from api/answers/:id
router.delete('/:id', withAuth, (req, res) => {
    Answer.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbAnswerData => {
            if (!dbAnswerData) {
                res.status(404).json({ message: 'No answer found with that id'});
                return;
            }
            res.json(dbAnswerData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })

});

module.exports = router;