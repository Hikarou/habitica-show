let connection = undefined;
let currentHabit = new Habit(userId, apiKey);

$(document).ready(function () {
    $('#btn-login').on('click', login);
});

function login(event) {
    console.log("passé par là");

    // Super basic validation - increase errorCount variable if any fields are blank
    let errorCount = 0;
    $('#login input').each(function (index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {
        connection = {
            userId: $('#login fieldset input#userId').val(),
            apiKey: $('#login fieldset input#apiKey').val(),
            apiUrl: $('#login fieldset input#apiUrl').val()
        }
    } else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
}
