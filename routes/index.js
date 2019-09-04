const express = require('express');
const router = express.Router();
const Habit = require('../lib/habitica');

// Current params for API connection
let userId = "0";
let apiKey = "0";
let apiUrl = undefined;
let user = undefined;
let currentHabit = new Habit(userId, apiKey);

/**
 * Get all the tasks for render in index
 * @param res The response that render will be call upon
 * @param vue The view to be called
 * @param ready Either there is someone logged
 * @param apiStatus The apiStatus
 */
const showTasks = function (res, vue, ready, apiStatus) {
    currentHabit.getTodoTasks(function (error, response) {
        let todos = response.body.data;
        currentHabit.getDailiesTasks(function (error, response) {
            let dailies = response.body.data;
            currentHabit.getHabitsTasks(function (error, response) {
                let habits = response.body.data;
                res.render(vue, {
                    logged: ready,
                    apiStatus: apiStatus,
                    profile: user.auth.local.username,
                    todos: todos,
                    dailies: dailies,
                    habits: habits
                });
            });
        });
    });
};

// Get the Home page
router.get('/', function (req, res, next) {
    // get the status of the API or the official API if apiUrl not defined
    currentHabit.getStatus(function (error, response) {
        const vue = 'index';
        const apiStatus = JSON.parse(response.text).data.status;
        const ready = userId !== "0" && apiKey !== "0";
        // If the user is not logged
        if (!ready) {
            res.render(vue, {
                logged: ready,
                apiStatus: apiStatus
            })
        } else {
            // Logging
            if (user === undefined) {
                currentHabit.getUser(function (error, response) {
                    user = JSON.parse(response.text).data;
                    showTasks(res, vue, ready, apiStatus);
                });
            } else { // Logged
                showTasks(res, vue, ready, apiStatus);
            }
        }
    });
});

// For log in purpose
router.post('/login', function (req, res, next) {
    userId = req.body.userId;
    apiKey = req.body.apiKey;
    apiUrl = req.body.apiUrl;
    currentHabit = new Habit(userId, apiKey, apiUrl);
    res.redirect('/');
});

// For logout purpose
router.post('/logout', function (req, res, next) {
    userId = "0";
    apiKey = "0";
    apiUrl = undefined;
    currentHabit = new Habit(userId, apiKey, apiUrl);
    res.redirect('/');
});
module.exports = router;
