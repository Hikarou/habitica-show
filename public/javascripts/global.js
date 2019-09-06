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
const pageIndiff = $('#indiff');
const catTodos = $('#todos');
const catDailies = $('#dailies');
const catHabits = $('#habits');
const welcomeMessage = $('#welcome');
const banniereLogin = $('#h_login');
const banniereLogged = $('#h_logged');
const pageTasks = $('#tasks');

$(document).ready(function () {
    $('#btn-login').on('click', login);
    $('#h_c_logout').on('click', logout);
    $('#h_c_l').on('click', getLogin);
    $('#h_c_a').on('click', getAbout);
    $('#h_c_about').on('click', getAbout);
    banniereLogged.hide();
});

function getLogin() {
    pageLogged.hide();
    pageIndiff.hide();
    pageLogin.show();
}

function getAbout(){
    pageLogged.hide();
    pageLogin.hide();
    pageIndiff.show();
}

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

                pageLogin.hide();
                banniereLogin.hide();
                welcomeMessage.html('Welcome ' + user.auth.local.username + ' !');
                showTasks();
                pageLogged.show();
                banniereLogged.show();
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
    pageLogged.hide();
    banniereLogged.hide();
    connection = undefined;
    user = undefined;
    todos = undefined;
    dailies = undefined;
    habits = undefined;
    pageLogin.show();
    banniereLogin.show();
}

/**
 * Get all the tasks for render in index
 */
const showTasks = function () {
    pageLogged.show();
    pageTasks.show();
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
};
