/**
 * All informations needed to run those pages
 */
let connection = undefined;
let user = undefined;
let todos = undefined;
let dailies = undefined;
let habits = undefined;
let taskHistory = undefined;

////// All elements needed several times
//// Not logged part
const headerLogin = $('#h_login');
const pageLogin = $('#login');
// login formular entries
const inputUserID = $('#userId');
const inputApiKey = $('#apiKey');
const inputApiUrl = $('#apiUrl');

//// Logged part
const headerLogged = $('#h_logged');
const pageLogged = $('#logged');
const welcomeMessage = $('#welcome');
// Tasks (index) page with its elements
const pageTasks = $('#tasks');
const catTodos = $('#todos');
const catDailies = $('#dailies');
const catHabits = $('#habits');
// page creating batch with it elements
const pageBatch = $('#batch');
const batchTasks = $('#text-batch');
const batchTaskType = $("[name='taskType']");
// page Graph with its elements
const pageGraph = $('#graph');
const showPlot = document.getElementById('plot'); // For plotly

//// Neither logged nor not logged part
const pageIndiff = $('#indiff');

// Will be triggered when the page is loaded
$(document).ready(function () {
    // Header interaction
    $('#h_c_logout').on('click', logout);
    $('#h_c_l').on('click', getLogin);
    $('#h_c_a').on('click', getAbout);
    $('#h_c_about').on('click', getAbout);
    $('#h_c_index').on('click', getTasks);
    $('#h_c_batch').on('click', getBatch);
    $('#h_c_graph').on('click', getGraph);
    // Buttons
    $('#btn-login').on('click', login);
    $('#btn_tasks_refresh').on('click', refreshTasks);
    $('#btn-batch').on('click', addTasks);
    headerLogged.hide(); // This is needed since the banniere is displayed as flex and can not be hidden beforehand
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
            if (status === "success" && data.user !== undefined) {
                user = data.user;
                pageLogin.hide();
                headerLogin.hide();
                welcomeMessage.html('Welcome ' + user.auth.local.username + ' !');
                getTasks(false);
                pageLogged.show();
                headerLogged.show();
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
    headerLogged.hide();
    connection = undefined;
    user = undefined;
    todos = undefined;
    dailies = undefined;
    habits = undefined;
    inputUserID.val("");
    inputApiKey.val("");
    inputApiUrl.val("");
    pageLogin.show();
    headerLogin.show();
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
    pageBatch.hide();
    pageGraph.hide();
    catTodos.html('<h1>TODOS</h1><img src="/images/805.gif" width="64px" height="64px">');
    catDailies.html('<h1>DAILIES</h1><img src="/images/805.gif" width="64px" height="64px">');
    catHabits.html('<h1>HABITS</h1><img src="/images/805.gif" width="64px" height="64px">');
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

/**
 * Get the batch page
 */
const getBatch = function () {
    pageIndiff.hide();
    pageTasks.hide();
    pageGraph.hide();
    pageLogged.show();
    pageBatch.show();
};

/**
 * Translation task type from formular to what is expected for API
 * @type {{"0": string, "1": string, "2": string}}
 */
const taskTypeTranslation = {
    0: "todo",
    1: "daily",
    2: "habit"
};

/**
 * Create the tasks
 */
const addTasks = function () {
    let tasks = batchTasks.val().split('\n').filter(val => val !== "");
    // Since batchTaskType is a JSON object looking like an array :
    let taskType = batchTaskType.filter((index, val) => val.checked);
    if (taskType.length !== 1) {
        alert('Something is wrong with the task type !');
    } else if (tasks === undefined || tasks.length === 0) {
        alert('There is no tasks to create !');
    } else {
        $.ajax({
            type: 'POST',
            url: '/createTasks',
            data: JSON.stringify({
                tasks: tasks.map(task => {
                    return {
                        "text": task,
                        "type": taskTypeTranslation[taskType.val()]
                    }
                }),
                connection: connection
            }),
            error: function () {
                alert('Something went wrong with creating the tasks');
            },
            complete: function () {
                batchTasks.val("");
                getTasks(true);
            },
            contentType: "application/json",
            dataType: 'json'
        });
    }
};

/**
 * Plotting 
 */
const plotting = function () {
    let data = [{
        x: Array.from({length: 24}, (_, k) => k),
        y: Array.from({length: 24}, () => 0),
        name: "Events",
        type: 'bar'
    }];
    const layout = {
        title: "Number of events (habits and dailies) per hour",
        showlegend: true,
    };
    const config = {};
    if (taskHistory !== undefined) {
        taskHistory.forEach((elem, _) => data[0].y[elem["Date"].getHours()]++);
        Plotly.plot(showPlot, data, layout, config);
    }
};

/**
 * Get the graph page
 */
const getGraph = function () {
    pageIndiff.hide();
    pageTasks.hide();
    pageBatch.hide();
    // Fetch the data once
    if (taskHistory === undefined) {
        $.getJSON('/getHistoryCSV', connection, function (data, status) {
            if (status === "success") {
                taskHistory = data.map(x => {
                    return {
                        Type: x["Task Type"],
                        Date: new Date(x["Date"]),
                        Value: x["Value"]
                    }
                });
                plotting();
            } else {
                alert("Could not fetch the history.\nPlease, try again later.");
            }
        });
    } else {
        plotting();
    }
    pageLogged.show();
    pageGraph.show();
};
