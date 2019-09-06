/**
 * All informations needed to run those pages
 */
let connection = undefined;
let user = undefined;
let todos = undefined;
let dailies = undefined;
let habits = undefined;

////// All elements needed several times
//// Not logged part
const banniereLogin = $('#h_login');
const pageLogin = $('#login');
// login formular entries
const inputUserID = $('#userId');
const inputApiKey = $('#apiKey');
const inputApiUrl = $('#apiUrl');

//// Logged part
const banniereLogged = $('#h_logged');
const pageLogged = $('#logged');
const welcomeMessage = $('#welcome');
// Tasks (index) page with its elements
const pageTasks = $('#tasks');
const catTodos = $('#todos');
const catDailies = $('#dailies');
const catHabits = $('#habits');
// page creating batch with it elements
const pageBatch = $('#batch');
// page Graph with its elements
const pageGraph = $('#graph');

//// Neither logged nor not logged part
const pageIndiff = $('#indiff');

// Will be triggered when the page is loaded
$(document).ready(function () {
    $('#btn-login').on('click', login);
    $('#btn_tasks_refresh').on('click', refreshTasks);
    $('#h_c_logout').on('click', logout);
    $('#h_c_l').on('click', getLogin);
    $('#h_c_a').on('click', getAbout);
    $('#h_c_about').on('click', getAbout);
    $('#h_c_index').on('click', getTasks);
    banniereLogged.hide(); // This is needed since the banniere is displayed as flex and can not be hidden beforehand
});

/**
 * The the login page
 */
const getLogin = function () {
    pageLogged.hide();
    pageIndiff.hide();
    pageLogin.show();
};

/**
 * get the about page
 */
const getAbout = function () {
    pageLogged.hide();
    pageLogin.hide();
    pageIndiff.show();
};

/**
 * Login action
 */
const login = function () {
    let valUserID = inputUserID.val();
    let valApiKey = inputApiKey.val();
    let valApiUrl = inputApiUrl.val();
    if ("" !== valUserID && "" !== valApiKey) {
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
                getTasks();
                pageLogged.show();
                banniereLogged.show();
            } else {
                alert('Something is wrong with your credentials');
                logout();
            }
        });
    } else {
        alert('Please fill in userID and apiKey fields');
    }
};

/**
 * Logout action
 */
const logout = function () {
    pageLogged.hide();
    banniereLogged.hide();
    connection = undefined;
    user = undefined;
    todos = undefined;
    dailies = undefined;
    habits = undefined;
    pageLogin.show();
    banniereLogin.show();
};

/**
 * Show the tasks in the page
 * @param todos The todos to show
 * @param dailies The dailies to show
 * @param habits The habits to show
 */
const showTasks = function (todos, dailies, habits) {
    let todosToShow = '<h1>TODOS</h1>\n';
    todos.forEach(elem => todosToShow += '<div class="task">' + elem.text + '</div>\n');
    catTodos.html(todosToShow);

    let dailiesToShow = '<h1>DAILIES</h1>\n';
    dailies.forEach(elem => dailiesToShow += '<div class="task">' + elem.text + '</div>\n');
    catDailies.html(dailiesToShow);

    let haibitsToShow = '<h1>HABITS</h1>\n';
    habits.forEach(elem => haibitsToShow += '<div class="task">' + elem.text + '</div>\n');
    catHabits.html(haibitsToShow);
};

/**
 * Refresh the tasks
 */
const refreshTasks = function () {
    getTasks(true);
};

/**
 * Get all the tasks for render in index
 * @param forceResync : boolean to force fetch the last tasks
 */
const getTasks = function (forceResync) {
    pageIndiff.hide();
    pageLogged.show();
    pageTasks.show();

    if ((typeof forceResync === 'boolean' && forceResync) || (todos === undefined && dailies === undefined && habits === undefined)) {
        // Need to fetch de data on the server
        $.getJSON('/getTasks', connection, function (data, status) {
            if (status === "success") {
                todos = data.todos;
                dailies = data.dailies;
                habits = data.habits;
                showTasks(todos, dailies, habits);
            } else {
                alert('Something went wrong with retrieving the tasks');
            }
        });
    } else {
        showTasks(todos, dailies, habits);
    }
};
