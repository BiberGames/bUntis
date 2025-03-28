import { utils } from './utils.js';
import { event } from './event.js';

const timetable = {};
const tableColums = [];

function createTimegrid(_timeGridData, _dates) {
    let timeTableContainer = document.getElementById('timeTable');
    let timeColum = document.createElement('div');
    
    timeColum.classList.add('timeTableTimeColum');
    timeColum.id = 'timeTableTimeColum';
    
    let timeColumHeader = document.createElement('div');
    timeColumHeader.innerHTML = 'Times';
    
    timeColumHeader.classList.add('timeTableHeader');
    timeColumHeader.id = 'timeTableHeader';
    timeColum.appendChild(timeColumHeader);

    let timeColumContainer = document.createElement('div');
    timeColumContainer.classList.add('timeColumContainer');
    timeColumContainer.id = 'timeColumContainer';
    timeColum.appendChild(timeColumContainer);

    timeTableContainer.appendChild(timeColum);
    tableColums.push(timeColum);
    
    _timeGridData.forEach((element) => {
	let colum = document.createElement('div');
	colum.classList.add('timeTableColum');
	colum.id = 'timeTableColum';
	
	let columHeader = document.createElement('div');
	columHeader.innerHTML = utils.getWeekDayByID(element.day);
	columHeader.classList.add('timeTableHeader');
	colum.appendChild(columHeader);

	let columContainer = document.createElement('div');
	columContainer.classList.add('columContainer');
	columContainer.id = `${_dates[element.day -2]}`;
	colum.appendChild(columContainer);
	
	timeTableContainer.appendChild(colum);
	tableColums.push(colum);
    });
}

function timeToMinutes(time) {
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    return hours * 60 + minutes;
}

function timeToPercent(_startBase, _endBase, _time) {
    const startMinutes = timeToMinutes(_startBase);
    const endMinutes = timeToMinutes(_endBase);
    const totalRange = endMinutes - startMinutes;

    const timeMinutes = timeToMinutes(_time);
    var percent = ((timeMinutes - startMinutes) / totalRange) * 100;
    percent = Math.max(0, Math.min(100, percent));
    percent = percent.toFixed(2); // remove js shit float calc...
    
    return parseFloat(percent);
}

function populateTimeColum(_timeGridData) {
    const timeTableTimeColum = document.getElementById('timeColumContainer');

    _timeGridData.timeUnits.forEach(entry => {
	const startBase = 745;
	const endBase = 1515;
	
        const elementStart = timeToPercent(startBase, endBase, entry.startTime);
        const elementLength = timeToPercent(startBase, endBase, entry.endTime) - timeToPercent(startBase, endBase, entry.startTime);
        
        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.top = `${elementStart}%`;
        div.style.height = `${elementLength}%`;

	var timeTop = document.createElement('div');
        timeTop.innerHTML = `${utils.convertUnitsTime(entry.startTime)}`;
	timeTop.style.top = '0';
	div.appendChild(timeTop);
	
	var timeBottom = document.createElement('div');
        timeBottom.innerHTML = `${utils.convertUnitsTime(entry.endTime)}`;
	timeBottom.style.marginTop = '190%'; 
	div.appendChild(timeBottom);
        
        timeTableTimeColum.appendChild(div);
    });
}

function addSubjectToTable(_div, _timeTableData) {
    var room = _timeTableData.ro[0].name.split('-');
    var text = _timeTableData.su[0].name + '<br>' + _timeTableData.sg.slice(-2) + '<br>' + room[0];
    if(_timeTableData.ro[0].orgname)
	text = _timeTableData.su[0].name + '<br>' + _timeTableData.sg.slice(-2) + '<br>' + '<p class="roomChange">' + room[0] + '</p>';
    
    if(_timeTableData.substText) {
        text += '<br> <p class="roomChange">' + _timeTableData.substText + '</p>';
        _timeTableData.code = 'sup';
    }

    _div.innerHTML = text;
}

function addSubjectWithoutRoom(_div, _timeTableData) {
    var text = _timeTableData.su[0].name + '<br>' + _timeTableData.sg.slice(-2);
    _div.innerHTML = text;
}

function addEvent(_div, _timeTableData) {
    var text = _timeTableData.substText;
    _div.innerHTML = text;
}

function populateTimeTableCollum(_timeTableData, _date) {
    const timeTableColum = document.getElementById(_date);

    const entry = _timeTableData;

    const startBase = 745; // remove hardcoded value!
    const endBase = 1515;  // remove hardcoded value!
    
    const elementStart = timeToPercent(startBase, endBase, entry.startTime);
    const elementLength = timeToPercent(startBase, endBase, entry.endTime) - timeToPercent(startBase, endBase, entry.startTime);
    
    var div = document.createElement('div');

    if(_timeTableData.su.length > 0 && _timeTableData.ro.length > 0) { // normal subject with room number and name
        addSubjectToTable(div, _timeTableData);
    }
    else if(_timeTableData.su.length > 0 && _timeTableData.ro.length == 0) { // normal subject with name and without room number
        addSubjectWithoutRoom(div, _timeTableData);
    }
    else if(_timeTableData.su.length === 0 && _timeTableData.ro.length == 0 && _timeTableData.kl.length > 1) {
	addEvent(div, _timeTableData);
    }
    
    div.classList.add('timeTableElement');
    div.classList.add(entry.code || 'default');
    
    div.style.position = 'absolute';
    div.style.top = `${elementStart}%`;
    div.style.height = `${elementLength}%`;
    div.style.width = `100vw`;

    timeTableColum.appendChild(div);
}


function filterTimeTableData(_timeTableData) {
    return _timeTableData.filter(entry =>
	utils.isMyClass(global.classes, entry.sg) || entry.lstext || entry.free
    );
}

function populateTimeTable(_timeTableData, _dates) {
    _timeTableData.forEach(entry => {
        const dayIndex = _dates.indexOf(entry.date);
        if (dayIndex !== -1) {
	    populateTimeTableCollum(entry, entry.date);
        }
    });
}

function getWeekRange(_timeTableData) {
    const tableDates = [];
    
    _timeTableData.forEach(entry => {
	tableDates.push(entry.date);
    });

    return utils.removeDuplicatesAndSort(tableDates);
}

function mergeEntries(schedule) {
    let filteredSchedule = [...schedule];
    let i = 0;
    
    while (i < filteredSchedule.length - 1) {
	let entry1 = filteredSchedule[i];
	let entry2 = filteredSchedule[i + 1];
	
	if (entry1.date === entry2.date && entry1.startTime < entry2.endTime && entry1.endTime > entry2.startTime) {
            if (entry1.code === "irregular" && entry1.su.length === 0 && entry1.ro.length === 0 && entry1.kl.length > 1) {
		filteredSchedule.splice(i + 1, 1);
		continue;
            } else if (entry2.code === "irregular" && entry2.su.length === 0 && entry2.ro.length === 0 && entry2.kl.length > 1) {
		filteredSchedule.splice(i, 1);
		continue;
            }
	}
	i++;
    }
    
    const tableWeekDates = getWeekRange(filteredSchedule);
    const weekDates = utils.getWeekDatesByRange(Math.min(...tableWeekDates), Math.max(...tableWeekDates));
/*    
    weekDates.forEach(weekDate => {
	filteredSchedule.forEach(lesson => {
	    console.log(weekDate + ' ' + lesson.sg);
	});
	console.log('---------------');
    });
*/  
    return filteredSchedule;
}

function updateTimeIndicator() {
    const timeIndicator = document.getElementById('timeIndicator');
    const startBase = 745; // remove hardcoded value!
    const endBase = 1515;  // remove hardcoded value!
    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeIndicatorTop = timeToPercent(startBase, endBase, hours + minutes);

    timeIndicator.style.top = `${timeIndicatorTop + 3}%`;
}

timetable.createTable = function(_timeTableData, _timeGridData, _id) {
    console.log('Creating Table...');
    
    var filterdTimeTableData = filterTimeTableData(_timeTableData);
    filterdTimeTableData = mergeEntries(filterdTimeTableData);
    const tableWeekDates = getWeekRange(filterdTimeTableData);
    const weekDates = utils.getWeekDatesByRange(Math.min(...tableWeekDates), Math.max(...tableWeekDates));

    createTimegrid(_timeGridData, weekDates);
    populateTimeColum(_timeGridData[0]);
    populateTimeTable(filterdTimeTableData, weekDates);

    updateTimeIndicator();

    setInterval(function() {
	updateTimeIndicator();
    }, 60 * 1000); // 60 * 1000 milsec
    
    console.log('Table Created...');
}

export { timetable };
