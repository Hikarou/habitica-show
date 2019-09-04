const request = require('superagent');

/**
 * The different existing routes
 * @type {{users: string, tasks: string}}
 */
const routes = {
    users: '/user',
    tasks: '/tasks'
};

/**
 * Habitica API parameters for connection
 * @param userId User ID
 * @param apiKey API Key
 * @param apiUrl API URL or default : 'https://habitica.com/api/v3'
 * @constructor
 */
function Habitica(userId, apiKey, apiUrl) {
    this.userId = userId;
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || 'https://habitica.com/api/v3';
}

/**
 * Builds a request for the API
 * @param method GET, POST, PUT or DEL
 * @param endpoint Endpoint to ask i.e. : /users
 * @param sendObj If there is params to send
 * @returns {*|request}
 */
Habitica.prototype.buildRequest = function (method, endpoint, sendObj) {
    const url = this.apiUrl + endpoint;
    console.log(url);
    let req = request;

    if (method === 'GET') {
        req = req.get(url);
    } else if (method === 'POST') {
        if (sendObj) {
            req = req.post(url).send(sendObj);
        } else {
            req = req.post(url);
        }
    } else if (method === 'PUT') {
        req = req.put(url).send(sendObj);
    } else if (method === 'DEL') {
        req = req.del(url);
    }

    req = req.set('x-api-user', this.userId)
        .set('x-api-key', this.apiKey)
        .set('Accept', 'application/json');
    console.log(req);
    return req;
};

/**
 * Get the API status
 * @param cb callback
 */
Habitica.prototype.getStatus = function (cb) {
    const req = this.buildRequest('GET', '/status');
    req.end(cb);
};

/**
 * Get the logged user
 * @param cb callback
 */
Habitica.prototype.getUser = function (cb) {
    const req = this.buildRequest('GET', routes.users);
    req.end(cb);
};

/**
 * Get all the tasks (todos, habits, dailies)
 * @param cb
 */
Habitica.prototype.getAllTasks = function (cb) {
    const req = this.buildRequest('GET', routes.tasks + '/user');
    req.end(cb);
};

/**
 * Get the t0do tasks
 * @param cb callback
 */
Habitica.prototype.getTodoTasks = function (cb) {
    const req = this.buildRequest('GET', routes.tasks + '/user?type=todos');
    req.end(cb);
};

/**
 * Get the habits tasks
 * @param cb callback
 */
Habitica.prototype.getHabitsTasks = function (cb) {
    const req = this.buildRequest('GET', routes.tasks + '/user?type=habits');
    req.end(cb);
};

/**
 * Get the dailies tasks
 * @param cb callback
 */
Habitica.prototype.getDailiesTasks = function (cb) {
    const req = this.buildRequest('GET', routes.tasks + '/user?type=dailys');
    req.end(cb);
};

module.exports = Habitica;
