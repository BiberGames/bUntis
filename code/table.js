import { utils } from './utils.js';
import { event } from './event.js';

const timetable = {};

var timeTableData = '';
var dates = [];

const timetableStructure = [
    [" ", "Times", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    ["1", "07:45<br><br>08:30", "", "", "", "", ""],
    ["2", "08:35<br><br>09:20", "", "", "", "", ""],
    ["3", "09:40<br><br>10:25", "", "", "", "", ""],
    ["4", "11:30<br><br>11:15", "", "", "", "", ""],
    ["5", "11:35<br><br>12:20", "", "", "", "", ""],
    ["6", "12:25<br><br>13:10", "", "", "", "", ""],
    ["7", "13:40<br><br>14:25", "", "", "", "", ""],
    ["8", "14:30<br><br>15:15", "", "", "", "", ""],
];

function generateTable(data, id) {
    const tableContainer = document.querySelector('.timeTables');
    const table = document.createElement('table');
    table.setAttribute('id', 'TimeTable ' +id);
    table.classList.add('TimeTable');
    
    data.forEach(rowData => {
	const row = document.createElement('tr');
	rowData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.innerHTML = cellData;
            row.appendChild(cell);
	});
	table.appendChild(row);
    });
    
    tableContainer.appendChild(table);
    global.mainTimeTable = document.getElementById('TimeTable 0');
}

function setCellStatusColor(x, y, code) {
    if(utils.getCellInTable(global.mainTimeTable, x, y).classList.value !== 'timeTableElement')
        return;

    switch(code) {
    case 'irregular':
        utils.getCellInTable(global.mainTimeTable, x, y).classList.add('irregular');
        break;
	
    case 'cancelled':
        // adds zero width char to make merging simpler
        utils.getCellInTable(global.mainTimeTable, x, y).classList.add('cancelled');
        utils.getCellInTable(global.mainTimeTable, x, y).innerHTML += '​';
        break;
	
    case 'sup':
        utils.getCellInTable(global.mainTimeTable, x, y).classList.add('sup');
        utils.getCellInTable(global.mainTimeTable, x, y).innerHTML += '​';
        break;
	
    case 'err':
        utils.getCellInTable(global.mainTimeTable, x, y).classList.add('err');
        break;

    case 'free':
	utils.getCellInTable(global.mainTimeTable, x, y).classList.add('free');
	break
	
    default:
        utils.getCellInTable(global.mainTimeTable, x, y).classList.add('default');
        break;
    }
}

function addSubjectToTable(x, y, timeTableData) {
    var room = timeTableData.ro[0].name.split('-');
    var text = timeTableData.su[0].name + '<br>' + timeTableData.sg.slice(-2) + '<br>' + room[0];
    if(timeTableData.ro[0].orgname)
	text = timeTableData.su[0].name + '<br>' + timeTableData.sg.slice(-2) + '<br>' + '<p class="roomChange">' + room[0] + '</p>';
    
    if(timeTableData.substText) {
        text += '<br> <p class="roomChange">' + timeTableData.substText + '</p>';
        timeTableData.code = 'sup';
    }

    //console.log(timeTableData.sg.slice(-2));

    utils.setContentInTable(global.mainTimeTable, x + 2, y + 1, text);
    
    //console.log(timeTableData.date);
    setCellStatusColor(x + 2, y + 1, timeTableData.code);
}

function addSubjectWithoutRoom(x, y, timeTableData) {
    //console.log(timeTableData);
    var text = timeTableData.su[0].name + '<br>' + timeTableData.sg.slice(-2);
    utils.setContentInTable(global.mainTimeTable, x + 2, y + 1, text);

    //console.log(timeTableData.sg.slice(-2));
    
    //console.log(timeTableData.id);
    setCellStatusColor(x + 2, y + 1, timeTableData.code);
}

function addEventToTable(x, y, timeTableData) {
    var text = timeTableData.lstext;
    var rawEventLength = utils.timeToElements(timeTableData.endTime) - utils.timeToElements(timeTableData.startTime);

    setCellStatusColor(x +2, y +1, timeTableData.code);
    utils.setContentInTable(global.mainTimeTable, x +2, y +1, text);
    utils.getCellInTable(global.mainTimeTable, x +2, y +1).rowSpan = rawEventLength+1;

    for (let i = 1; i < rawEventLength +1; i++) {
        utils.getCellInTable(global.mainTimeTable, x +2, y +1 +i).style.display = 'none';
    }

    utils.getCellInTable(global.mainTimeTable, x +2, y +1).onclick = function() {showPage(4); event.update(timeTableData);};
}

function addHolidayToTable(x, y, timeTableData) {
    utils.setContentInTable(global.mainTimeTable, x +2, y +1, timeTableData.name + "<br>" + timeTableData.longName);
    
    setCellStatusColor(x + 2, y + 1, timeTableData.code);
    utils.getCellInTable(global.mainTimeTable, x +2, y +1).rowSpan = 8;
    
    for (let i = 1; i < 8; i++) {
        utils.getCellInTable(global.mainTimeTable, x +2, y +1 +i).style.display = 'none';
    }
}

function dataToTable(timeTableData, x, y) {
    utils.getCellInTable(global.mainTimeTable, x+2, y+1).classList.add('timeTableElement');
    if(utils.isMyClass(global.classes, timeTableData.sg) || timeTableData.lstext || timeTableData.free) {
        try {
            if(!timeTableData.free && timeTableData.su.length > 0 && timeTableData.ro.length > 0) { // normal subject with room number and name
                addSubjectToTable(x, y, timeTableData);
            }
            else if(!timeTableData.free && timeTableData.su.length > 0 && timeTableData.ro.length == 0) { // normal subject with name and without room number
                addSubjectWithoutRoom(x, y, timeTableData);
            }
            else if(!timeTableData.free && timeTableData.lstext.length > 0) { // normal subject with name but without room number
                addEventToTable(x, y, timeTableData);
            }
	    
            // Merging subjects to blocks for better readability...
            utils.mergeCells(mainTimeTable, x+2, y+1);
        }
        catch(e) {
	    console.log(timeTableData);
            if(timeTableData.su) {
                utils.setContentInTable(global.mainTimeTable, x + 2, y + 1, timeTableData.su[0].name);
            }
            console.info(timeTableData);
            console.info(e);
            setCellStatusColor(x + 2, y + 1, 'err');
        }
    }
}

function populateTableSpecificDay(timeTableData, day) {
    switch(timeTableData.startTime) {
    case 745:
	dataToTable(timeTableData, day, 0);
        break;
            
    case 835:
        dataToTable(timeTableData, day, 1);
        break;

    case 940:
        dataToTable(timeTableData, day, 2);
        break;

    case 1030:
        dataToTable(timeTableData, day, 3);
        break;

    case 1135:
        dataToTable(timeTableData, day, 4);
        break;

    case 1225:
        dataToTable(timeTableData, day, 5);
        break;

    case 1340:
        dataToTable(timeTableData, day, 6);
        break;

    case 1430:
        dataToTable(timeTableData, day, 7);
        break;
    }
}

timetable.createTable = function(_timeTableData, _holidayData, id) {
    console.log("Creating Table...");
    generateTable(timetableStructure, id);
    console.log(timetableStructure);
    
    timeTableData = _timeTableData;

    dates = utils.getWeekDates();
    //console.log(dates);
    
    for (let i = 0; i < timeTableData.length; i++) {
        if(timeTableData[i].date == dates[0]) {
            populateTableSpecificDay(timeTableData[i], 0);
        }
        else if(timeTableData[i].date == dates[1]) {
            populateTableSpecificDay(timeTableData[i], 1);
        }
        else if(timeTableData[i].date == dates[2]) {
            populateTableSpecificDay(timeTableData[i], 2);
        }
        else if(timeTableData[i].date == dates[3]) {
            populateTableSpecificDay(timeTableData[i], 3);
        }
        else if(timeTableData[i].date == dates[4]) {
            populateTableSpecificDay(timeTableData[i], 4);
        }
    }
    
    console.log("Table Created...");
}

export { timetable };
