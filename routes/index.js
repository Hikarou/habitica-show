const express = require('express');
const router = express.Router();
const Habit = require('../lib/habitica');

/* API officiel
let userId = "APIUser";
let apiKey = "APItoken";
// */

//* API vide
let userId = "0";
let apiKey = "0";
// */


let currentHabit = new Habit(userId, apiKey);

/* API locale
let userId = "0";
let apiKey = "0";


let currentHabit = new Habit(userId, apiKey,);
// */

let user = undefined;


/* GET home page. */
router.get('/', function (req, res, next) {
    currentHabit.getStatus(function (error, response) {
        let vue = 'index';
        let apiStatus = JSON.parse(response.text).data.status;
        const ready = userId !== "0" && apiKey !== "0";
        if (!ready) {
            res.render(vue, {
                logged: ready,
                apiStatus: apiStatus
            })
        } else {
            if (user === undefined) {
                currentHabit.getUser(function (error, response) {
                    let user = JSON.parse(response.text).data;
                    currentHabit.getTodoTasks(function (error, response) {
                        let todos = response.body.data;
                        res.render(vue, {
                            logged: ready,
                            apiStatus: apiStatus,
                            profile: user.auth.local.username,
                            todos: todos
                        });
                    });
                });
            } else {
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
    currentHabit = new Habit(userId, apiKey);
    res.redirect('/');
});
module.exports = router;
