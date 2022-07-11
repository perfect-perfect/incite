const router = require('express').Router();
const { Answer, User, Voteanswer } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth')

// GET all answers /api/answers
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

// POST an answer /api/answers
router.post('/', withAuth, (req, res) => {
    // check the session
    if (req.session) {
        Answer.create({
            answer_text: req.body.answer_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        })
            .then(dbAnswerData => res.json(dbAnswerData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
});

// PUT upvote on post api/answers/upvote
router.put('/upvote', (req, res) => {
    Voteanswer.create({
        // using session user id
        user_id: req.session.user_id,
        post_id: req.body.post_id,
        answer_id: req.body.answer_id
    }).then(() => {
        // find the answer we just voted on and return it after upvote added. For Insomnia testing.
        return Answer.findOne({
            where: {
                id: req.body.answer_id
            },
            attributes: [
                'id',
                'answer_text',
                'created_at'
            ]
        })
    })
        .then(dbAnswerData => res.json(dbAnswerData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
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