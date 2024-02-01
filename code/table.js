const utils = require('../code/utils.js');

var timeTableData = '';
var dates = [];
var classes = [];

function setCellStatusColor(x, y, code) {
    utils.getCellInTable(mainTimeTable, x, y).classList.add('timeTableElement');

    switch(code) {
        case 'cancelled':
            // adds zero width char to make merging simpler
            utils.getCellInTable(mainTimeTable, x, y).classList.add('cancelled');
            utils.getCellInTable(mainTimeTable, x, y).innerHTML += '​';
            break;

        case 'irregular':
            utils.getCellInTable(mainTimeTable, x, y).classList.add('irregular');
            break;

        case 'sup':
            utils.getCellInTable(mainTimeTable, x, y).classList.add('sup');
            utils.getCellInTable(mainTimeTable, x, y).innerHTML += '​';
            break;

        case 'err':
            utils.getCellInTable(mainTimeTable, x, y).classList.add('err');
            break;

        default:
            utils.getCellInTable(mainTimeTable, x, y).classList.add('default');
            break;
    }
}

function addSubjectToTable(x, y, timeTableData) {
    //console.log(timeTableData);
    var text = timeTableData.su[0].name + '<br>' + timeTableData.sg.slice(-2) + '<br>' + '[' + timeTableData.ro[0].name + ']';

    if(timeTableData.substText) {
        text += '<br>' + timeTableData.substText;
        timeTableData.code = 'sup';
    }

    utils.setContentInTable(mainTimeTable, x + 2, y + 1, text);
    
    //console.log(timeTableData.id);
    setCellStatusColor(x + 2, y + 1, timeTableData.code);
}

function addSubjectWithoutRoom(x, y, timeTableData) {
    //console.log(timeTableData);
    var text = timeTableData.su[0].name + '<br>' + timeTableData.sg.slice(-2);
    utils.setContentInTable(mainTimeTable, x + 2, y + 1, text);
                
    //console.log(timeTableData.id);
    setCellStatusColor(x + 2, y + 1, timeTableData.code);
}

function addEventToTable(x, y, timeTableData) {
    console.log(timeTableData);
    var text = timeTableData.lstext;
    utils.setContentInTable(mainTimeTable, x + 2, y + 1, text);
    
    //console.log(timeTableData.id);
    setCellStatusColor(x + 2, y + 1, timeTableData.code);
}

function dataToTable(timeTableData, x, y) {
    if(utils.isMyClass(classes, timeTableData.sg) || timeTableData.lstext) {
        try {
            if(timeTableData.su.length > 0 && timeTableData.ro.length > 0) { // normal subject with room number and name
                addSubjectToTable(x, y, timeTableData);
            }
            else if(timeTableData.su.length > 0 && timeTableData.ro.length == 0) { // normal subject with name and without room number
                addSubjectWithoutRoom(x, y, timeTableData);
            }
            else if(timeTableData.lstext.length > 0) { // normal subject with name but without room number
                addEventToTable(x, y, timeTableData);
            }
            else {
                utils.setContentInTable(mainTimeTable, x + 2, y + 1, 'err');
            }

            // Merging subjects to blocks for better readability...
            utils.mergeCells(mainTimeTable, x+2, y+1);
        }
        catch(e) {
            if(timeTableData.su[0]) {
                utils.setContentInTable(mainTimeTable, x + 2, y + 1, timeTableData.su[0].name);
            }
            console.info(timeTableData);
            console.info(e);
            setCellStatusColor(x + 2, y + 1, 'err');
			//mergeCells(mainTimeTable, x+2, y+1);
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

const createTable = function(_classes, _timeTableData) {
	console.log("Creating Table...");

	timeTableData = _timeTableData;
	classes = _classes;
	
    for (let i = 0; i < timeTableData.length; i+=1) {
        dates.push(timeTableData[i].date);
    }
    dates = utils.removeDuplicatesAndSort(dates);

	for (let i = 0; i < timeTableData.length; i+=1) {
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

module.exports = {
    createTable
}
