const utils = require('./utils.js');

const eventTitle = document.getElementById('eventTitle');
const eventText = document.getElementById('eventText');

const update = function(data) {
    eventTitle.innerHTML = data.lstext;
    eventText.innerHTML = 'On ' + utils.convertUntisDate(data.date) + ' from '  + data.startTime + ' to ' + data.endTime + '<br>' + data.substText;
}

module.exports = {
    update
}
