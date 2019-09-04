const request = require('superagent');

const routes = {
    users: '/user',
    tasks: '/tasks'
};

function Habitica(userId, apiKey, apiUrl) {
    this.userId = userId;
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || 'https://habitica.com/api/v3';
}

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

Habitica.prototype.getStatus = function (cb) {
    const req = this.buildRequest('GET', '/status');
    req.end(cb);
};

Habitica.prototype.getUser = function (cb) {
    const req = this.buildRequest('GET', routes.users);
    req.end(cb);
};

Habitica.prototype.getAllTasks = function (cb) {
    const req = this.buildRequest('GET', routes.tasks + '/user');
    req.end(cb);
};

Habitica.prototype.getTodoTasks = function (cb) {
    const req = this.buildRequest('GET', routes.tasks + '/user?type=todos');
    req.end(cb);
};

Habitica.prototype.getHabitsTasks = function (cb) {
    const req = this.buildRequest('GET', routes.tasks + '/user?type=habits');
    req.end(cb);
};

Habitica.prototype.getDailiesTasks = function (cb) {
    const req = this.buildRequest('GET', routes.tasks + '/user?type=dailys');
    req.end(cb);
};

module.exports = Habitica;
