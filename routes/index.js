const express = require('express');
const router = express.Router();
const Habit = require('../lib/habitica');

const currentHabit = new Habit("APIUser", "APItoken");


/* GET home page. */
router.get('/', function (req, res, next) {
    currentHabit.getStatus(function (error, response) {
        res.render('index', {
            title: 'Express',
            apiStatus: JSON.parse(response.text).data.status
        });
    });
});
module.exports = router;
