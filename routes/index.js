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
        let todos = error !== undefined ? response.body.data : [];
        currentHabit.getDailiesTasks(function (error, response) {
            let dailies = error !== undefined ? response.body.data : [];
            currentHabit.getHabitsTasks(function (error, response) {
                let habits = error !== undefined ? response.body.data : [];
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
    res.render('index');
    /*
    // get the status of the API or the official API if apiUrl not defined
    currentHabit.getStatus(function (error, response) {
        if (response !== undefined && response.ok) {
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
        } else {
            habiticaReset();
            res.status = 503;
            res.render("error", {error: error, message: "API (" + apiUrl + ") is not reachable"});
        }
    });

    // */
});

router.get('/getUser', function (req, res, next) {
    currentHabit = new Habit(req.query.userId, req.query.apiKey, req.query.apiUrl);
    currentHabit.getUser(function (error, response) {
        let user = JSON.parse(response.text).data;
        res.json({
            user: user
        });
    });
});

router.get('/getTasks', function (req, res, next) {
    currentHabit = new Habit(req.query.userId, req.query.apiKey, req.query.apiUrl);
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
