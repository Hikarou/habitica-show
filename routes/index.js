const express = require('express');
const router = express.Router();
const Habit = require('../lib/habitica');


let userId = "0";
let apiKey = "0";
let apiUrl = undefined;
let user = undefined;
let currentHabit = new Habit(userId, apiKey);

/* GET home page. */
router.get('/', function (req, res, next) {
    // get the status of the official API
    currentHabit.getStatus(function (error, response) {
        let vue = 'index';
        let apiStatus = JSON.parse(response.text).data.status;
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
                    let user = JSON.parse(response.text).data;
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
                });
            } else { // Logged
                res.render(vue, {
                    logged: ready,
                    apiStatus: apiStatus,
                    profile: user.auth.local.username
                });
            }
        }
    });
});

router.post('/', function (req, res, next) {
    userId = req.body.userId;
    apiKey = req.body.apiKey;
    apiUrl = req.body.apiUrl;
    currentHabit = new Habit(userId, apiKey, apiUrl);
    res.redirect('/');
});

router.post('/logout', function (req, res, next) {
    userId = "0";
    apiKey = "0";
    apiUrl = undefined;
    currentHabit = new Habit(userId, apiKey, apiUrl);
    res.redirect('/');
});
module.exports = router;
