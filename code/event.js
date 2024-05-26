import { utils } from './utils.js';

const event = {};

const eventTitle = document.getElementById('eventTitle');
const eventText = document.getElementById('eventText');

event.update = function(data) {
    eventTitle.innerHTML = data.lstext;
    eventText.innerHTML = 'On ' + utils.convertUntisDate(data.date) + ' from '  + data.startTime + ' to ' + data.endTime + '<br>' + data.substText;
}

export { event };
