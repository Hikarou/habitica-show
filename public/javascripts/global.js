let connection = undefined;
let user = undefined;
let todos = [];
let dailies = [];
let habits = [];

$(document).ready(function () {
    $('#btn-login').on('click', login);
    $('#btn-logout').on('click', logout);
});

function login(event) {
    let userID = $('#userId').val();
    let apiKey = $('#apiKey').val();
    let apiUrl = $('#apiUrl').val();
    if (undefined !== userID && undefined !== apiKey) {
        connection = {
            userId: userID,
            apiKey: apiKey,
            apiUrl: apiUrl
        };

        console.log("connection :" + JSON.stringify(connection));

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

function logout(event) {
    connection = undefined;
    user = undefined;
    todos = [];
    dailies = [];
    habits = [];
    $('#login').show();
    $('#logged').hide();
}

/**
 * Get all the tasks for render in index
 * @param force If force refresh
 */
const showTasks = function () {
    $('#login').hide();
    $.getJSON('/getTasks', connection, function (data, status) {
        console.log(status);
        if (status === "success") {
            todos = data.todos;
            dailies = data.dailies;
            habits = data.habits;

            console.log(todos[0].text);
            let todosToShow = '<h1>TODOS</h1>\n';
            todos.forEach(elem => todosToShow += '<div class="task">' + elem.text + '</div>\n');
            $('#todos').html(todosToShow);

            let dailiesToShow = '<h1>DAILIES</h1>\n';
            dailies.forEach(elem => dailiesToShow += '<div class="task">' + elem.text + '</div>\n');
            $('#dailies').html(dailiesToShow);

            let haibitsToShow = '<h1>HABITS</h1>\n';
            habits.forEach(elem => haibitsToShow += '<div class="task">' + elem.text + '</div>\n');
            $('#habits').html(dailiesToShow);
        } else {
            alert('Something went wrong with retrieving the tasks');
            return false;
        }
    });
    $('#welcome').html('Welcome ' + user.auth.local.username + ' !');
    $('#logged').show();
};
