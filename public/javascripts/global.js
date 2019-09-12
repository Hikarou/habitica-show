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
const plotAllTasks = $('#all-tasks');
const stakedTasks = $('#stacked-tasks');
const xpEvol = $('#xp-evol');
const plotType = $("[name='graphType']");

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
    $('#btn-graph').on('click', plotSomething);
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
    pageIndiff.hide();
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
            if (status === "success" && data !== undefined) {
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
 * Get the number of days between two dates
 * @param date1 first date
 * @param date2 second date
 * @returns {number} number of days between two dates
 */
const daysBetween = function (date1, date2) {
    if (date1 === undefined || date2 === undefined) return -1;
    return Math.round(Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * Get the days in between the two days [startDate; endDate[
 * @param startDate
 * @param endDate
 * @returns {Date[]}
 */
const getDaysBetweenArray = function (startDate, endDate) {
    const duration = endDate - startDate;
    const dayInterval = 1000 * 60 * 60 * 24;
    const steps = duration / dayInterval;
    return Array.from({length: steps}, (v, i) => new Date(startDate.valueOf() + (dayInterval * i)));
};

/**
 * Plotting
 */
const plottingXPEvolution = function () {
    /**
     * Initialize a stack
     * @param name The name of the stack
     * @returns {{stackgroup: string, x: [], name: *, y: []}}
     */
    const initializeStack = function (name) {
        return {
            x: [],
            y: [],
            name: name,
            stackgroup: 'one'
        }
    };
    let todos = initializeStack("Todos");
    let habits = initializeStack("Habits");
    let dailies = initializeStack("Dailies");
    let baseXP = initializeStack("Base XP of the day");

    const layout = {
        title: "Evolution of XP in time",
        showlegend: true,
    };
    const config = {};
    if (taskHistory !== undefined) {
        let curBaseXP = 0;
        taskHistory.forEach((elem, _) => {
            let curDate = new Date(elem['Date'].getFullYear(), elem['Date'].getMonth(), elem['Date'].getDate());
            if (baseXP.x.length === 0 || baseXP.x[baseXP.x.length - 1] - curDate !== 0) { // New day, new entry
                // fill the gap if not played during whole days
                const numberOfDaysInBetween = daysBetween(baseXP.x[baseXP.x.length - 1], curDate);
                if (numberOfDaysInBetween > 1) {
                    let days = getDaysBetweenArray(baseXP.x[baseXP.x.length - 1], curDate);
                    days.shift();
                    days.forEach((day) => {
                        baseXP.x.push(day);
                        baseXP.y.push(curBaseXP);
                    });
                }
                baseXP.x.push(curDate);
                baseXP.y.push(curBaseXP);
            }
            curBaseXP += elem["Value"];

            /**
             * Adds the element in the given category
             * @param category
             */
            const addTheTaskToCategory = function (category) {
                if (category.x.length === 0 || category.x[category.x.length - 1] - curDate !== 0) {
                    category.x.push(curDate);
                    category.y.push(elem["Value"]);
                } else {
                    category.y[category.y.length - 1] += elem["Value"];
                }
            };

            if (elem["Type"] === "todo") {
                addTheTaskToCategory(todos);
            } else if (elem["Type"] === "habit") {
                addTheTaskToCategory(habits);
            } else {
                addTheTaskToCategory(dailies);
            }
        });
        let data = [baseXP, todos, habits, dailies];
        Plotly.newPlot(xpEvol[0], data, layout, config);
        xpEvol.show();
    }
};

/**
 * Initialize a bar
 * @param name The name of the stack
 * @returns {{x: *, name: *, y: *, type: string}}
 */
const initializeBarForADay = function (name) {
    return {
        x: Array.from({length: 24}, (_, k) => k),
        y: Array.from({length: 24}, () => 0),
        name: name,
        type: 'bar'
    }
};

/**
 * Plotting stacked bars
 */
const plottingStakedTasks = function () {
    let todos = initializeBarForADay("Todos");
    let habits = initializeBarForADay("Habits");
    let dailies = initializeBarForADay("Dailies");
    const layout = {
        title: "Number of events per hour, per task type",
        showlegend: true,
        barmode: 'stack'
    };
    const config = {};
    if (taskHistory !== undefined) {
        taskHistory.filter(x => x["Type"] === "todo").forEach((elem, _) => todos.y[elem["Date"].getHours()]++);
        taskHistory.filter(x => x["Type"] === "habit").forEach((elem, _) => habits.y[elem["Date"].getHours()]++);
        taskHistory.filter(x => x["Type"] === "daily").forEach((elem, _) => dailies.y[elem["Date"].getHours()]++);
        let data = [todos, habits, dailies];
        Plotly.newPlot(stakedTasks[0], data, layout, config);
        stakedTasks.show();
    }
};

/**
 * Bar plotting all tasks
 */
const plottingAllTasks = function () {
    let data = [initializeBarForADay("Events")];
    const layout = {
        title: "Number of events per hour",
        showlegend: true,
    };
    const config = {};
    if (taskHistory !== undefined) {
        taskHistory.forEach((elem, _) => data[0].y[elem["Date"].getHours()]++);
        Plotly.newPlot(plotAllTasks[0], data, layout, config);
        plotAllTasks.show();
    }
};

/**
 * Plot something
 */
const plotSomething = function () {
    plotAllTasks.hide();
    stakedTasks.hide();
    xpEvol.hide();
    let plot = plotType.filter((index, val) => val.checked);
    if (plot.length !== 1) {
        alert('Something is wrong with the plot type !');
    } else if (plot.val() === "0") {
        plottingAllTasks();
        plotAllTasks.show();
    } else if (plot.val() === "1") {
        plottingStakedTasks();
        stakedTasks.show();
    } else if (plot.val() === "2") {
        plottingXPEvolution();
        xpEvol.show();
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
            if (status === "success" && data !== undefined) {
                // Habits and dailies tasks
                taskHistory = data.map(x => {
                    return {
                        Type: x["Type"],
                        Date: new Date(x["Date"] + "Z"), // Z is for UTC time
                        Value: x["Value"]
                    }
                });

                // T0do tasks are stored in the user profile
                // Values are experience at a given point and we need to get the XP the achievement of the task gave
                let mapped_tasks = [];
                const reducer = (accumulator, currentValue) => {
                    mapped_tasks.push({
                        Date: currentValue.date,
                        Value: accumulator - currentValue.value // Values are negative
                    });
                    return currentValue.value;
                };
                user.history.todos.reduce(reducer);

                // Some tasks are not well defined with a readable date
                mapped_tasks.filter(x => typeof x.Date !== 'number')
                    .map(x => {
                        return {
                            Type: "todo",
                            Date: new Date(x.Date), // Here the date is already written with UTC format
                            Value: x.Value
                        }
                    }).forEach(x => taskHistory.push(x)); // Add the t0do tasks to the task history 

                taskHistory.sort((x, y) => x["Date"] - y["Date"]); // Sort the tasks by date for date related plots
                plotSomething();
            } else {
                alert("Could not fetch the history.\nPlease, try again later.");
            }
        });
    } else { // Use the already stored data
        plotSomething();
    }
    pageLogged.show();
    pageGraph.show();
};
