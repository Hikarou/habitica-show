const express = require('express');
const router = express.Router();
const Habit = require('../lib/habitica');

//* API officiel
let userId = "APIUser";
let apiKey = "APItoken";
// */

/* API vide
let userId = undefined;
let apiKey = undefined;
// */


const currentHabit = new Habit(userId, apiKey);
let user = undefined;


/* GET home page. */
router.get('/', function (req, res, next) {
    currentHabit.getStatus(function (error, response) {
        let vue = 'index';
        let apiStatus = JSON.parse(response.text).data.status;
        const ready = userId !== undefined && apiKey !== undefined;
        if (!ready) {
            res.render(vue, {
                logged: ready,
                apiStatus: apiStatus
            })
        } else {
            if (user === undefined) {
                currentHabit.getUser(function (error, response) {
                    user = JSON.parse(response.text).data;
                    res.render(vue, {
                        logged: ready,
                        apiStatus: apiStatus,
                        profile: user.auth.local.username
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
module.exports = router;
