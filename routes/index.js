const express = require('express');
const router = express.Router();
const Habit = require('../lib/habitica');

/**
 * Get the homepage route
 */
router.get('/', function (req, res, next) {
    res.render('index');
});

/**
 * The the current user route
 */
router.get('/getUser', function (req, res, next) {
    let currentHabit = new Habit(req.query.userId, req.query.apiKey, req.query.apiUrl);
    currentHabit.getUser(function (error, response) {
        let user = JSON.parse(response.text).data;
        res.json({
            user: user
        });
    });
});

/**
 * Get the tasks of the current user route
 */
router.get('/getTasks', function (req, res, next) {
    let currentHabit = new Habit(req.query.userId, req.query.apiKey, req.query.apiUrl);
    currentHabit.getTodoTasks(function (error, response) {
        let todos = error !== undefined ? response.body.data : [];
        currentHabit.getDailiesTasks(function (error, response) {
            let dailies = error !== undefined ? response.body.data : [];
            currentHabit.getHabitsTasks(function (error, response) {
                let habits = error !== undefined ? response.body.data : [];
                res.json({
                    todos: todos,
                    dailies: dailies,
                    habits: habits
                });
            });
        });
    });
});
module.exports = router;
