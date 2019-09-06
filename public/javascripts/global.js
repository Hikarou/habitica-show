let connection = undefined;
let user = undefined;
let todos = undefined;
let dailies = undefined;
let habits = undefined;

const inputUserID = $('#userId');
const inputApiKey = $('#apiKey');
const inputApiUrl = $('#apiUrl');
const pageLogin = $('#login');
const pageLogged = $('#logged');
const catTodos = $('#todos');
const catDailies = $('#dailies');
const catHabits = $('#habits');
const welcomeMessage = $('#welcome');
const banniereLogin = $('#h_login');
const banniereLogged = $('#h_logged');

$(document).ready(function () {
    $('#btn-login').on('click', login);
    $('#btn-logout').on('click', logout);
    banniereLogged.hide();
});

function login() {
    let valUserID = inputUserID.val();
    let valApiKey = inputApiKey.val();
    let valApiUrl = inputApiUrl.val();
    if (undefined !== valUserID && undefined !== valApiKey) {
        connection = {
            userId: valUserID,
            apiKey: valApiKey,
            apiUrl: valApiUrl
        };

        $.getJSON('/getUser', connection, function (data, status) {
            if (status === "success") {
                user = data.user;

                showTasks();
            } else {
                alert('Something is wrong with your credentials');
                logout();
                return false;
            }
        });
    } else {
        alert('Please fill in userID and apiKey fields');
        return false;
    }
}

function logout() {
    connection = undefined;
    user = undefined;
    todos = undefined;
    dailies = undefined;
    habits = undefined;
    pageLogin.show();
    pageLogged.hide();
}

/**
 * Get all the tasks for render in index
 */
const showTasks = function () {
    pageLogin.hide();
    banniereLogin.hide();
    $.getJSON('/getTasks', connection, function (data, status) {
        console.log(status);
        if (status === "success") {
            todos = data.todos;
            dailies = data.dailies;
            habits = data.habits;

            let todosToShow = '<h1>TODOS</h1>\n';
            todos.forEach(elem => todosToShow += '<div class="task">' + elem.text + '</div>\n');
            catTodos.html(todosToShow);

            let dailiesToShow = '<h1>DAILIES</h1>\n';
            dailies.forEach(elem => dailiesToShow += '<div class="task">' + elem.text + '</div>\n');
            catDailies.html(dailiesToShow);

            let haibitsToShow = '<h1>HABITS</h1>\n';
            habits.forEach(elem => haibitsToShow += '<div class="task">' + elem.text + '</div>\n');
            catHabits.html(haibitsToShow);
        } else {
            alert('Something went wrong with retrieving the tasks');
            return false;
        }
    });
    welcomeMessage.html('Welcome ' + user.auth.local.username + ' !');
    pageLogged.show();
    banniereLogged.show();
};
