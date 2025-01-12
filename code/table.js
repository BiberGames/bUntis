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
	// columContainer.innerHTML = _dates[element.day -2];
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
    // const startBase = 745; // 7:45
    // const endBase = 1515; // 15:15

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
        // div.style.backgroundColor = 'lightblue';
        
        div.innerHTML = `${utils.convertUnitsTime(entry.startTime)} <br> <br> ${utils.convertUnitsTime(entry.endTime)}`;
        
        timeTableTimeColum.appendChild(div);
    });
}

function populateTimeTableCollum(_timeTableData, _date) {
    console.log(_timeTableData);
    const timeTableColum = document.getElementById(_date);

    const entry = _timeTableData;

    const startBase = 745;
    const endBase = 1515;
    
    const elementStart = timeToPercent(startBase, endBase, entry.startTime);
    const elementLength = timeToPercent(startBase, endBase, entry.endTime) - timeToPercent(startBase, endBase, entry.startTime);
    
    var div = document.createElement('div');
    div.classList.add('timeTableElement');
    div.classList.add(entry.code || 'default');
    
    div.style.position = 'absolute';
    div.style.top = `${elementStart}%`;
    div.style.height = `${elementLength}%`;
    div.style.width = `calc(17.5% - 0.5em)`;
    
    div.innerHTML = `${entry.sg}`;
    
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

timetable.createTable = function(_timeTableData, _timeGridData, _id) {
    const filterdTimeTableData = filterTimeTableData(_timeTableData);

    console.log('Creating Table...');

    const tableWeekDates = getWeekRange(filterdTimeTableData);
    const weekDates = utils.getWeekDatesByRange(Math.min(...tableWeekDates), Math.max(...tableWeekDates));
    // console.log(weekDates);
    // console.log(tableWeekDates);
    
    createTimegrid(_timeGridData, weekDates);
    populateTimeColum(_timeGridData[0]);
    populateTimeTable(filterdTimeTableData, weekDates);
    
    const dates = utils.getWeekDates();
    // console.log(dates);
    /*    
	  _timeTableData.forEach(entry => {
          const dayIndex = dates.indexOf(entry.date);
          if (dayIndex !== -1) {
          // populateTableSpecificDay(entry, dayIndex);
          }
	  });
    */    
    console.log('Table Created...');
}

export { timetable };
