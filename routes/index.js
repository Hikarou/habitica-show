const express = require('express');
const router = express.Router();
const Habit = require('../lib/habitica');
const csv2json = require('csvjson-csv2json');

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
        res.json({user: (error === null) ? JSON.parse(response.text).data : undefined});
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

/**
 * Create an array of tasks
 */
router.post('/createTasks', function (req, res, next) {
    let currentHabit = new Habit(req.body.connection.userId, req.body.connection.apiKey, req.body.connection.apiUrl);
    let tasks = req.body.tasks;
    currentHabit.createTasks(tasks, function (error, response) {
        if (error === null) {
            res.send(response.body);
        } else {
            res.status(400).end();
        }
    })
});

/**
 * Get the history
 */
router.get('/getHistoryCSV', function (req, res, next) {
    let currentHabit = new Habit(req.query.userId, req.query.apiKey, req.query.apiUrl);
    currentHabit.getHistory(function (error, response, next) {
        if (error === null) {
            // Get the CSV, transform it to JSON and get rid of useless data for us
            res.send(csv2json(response.text, {parseNumbers: true}).map(x => {
                return {
                    Type: x["Task Type"],
                    Date: x["Date"],
                    Value: x["Value"]
                }
            }));
        } else {
            res.status(400).end();
        }
    })
});
module.exports = router;
