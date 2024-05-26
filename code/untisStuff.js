const electron = require('electron');
const { ipcRenderer } = require('electron');

import { utils } from '../code/utils.js';
//import md5 from'../code/md5.js';
import { timetable } from '../code/table.js';
import { homework } from '../code/homework.js';
import { settings } from '../code/settings.js';
import { inbox } from '../code/inbox.js';

const whookURL = '';

var myClasses = '';
var holidayData = '';

var mainTimeTable = document.getElementById('timeTables');
const homeWorkTable = document.getElementById('homeWorkTable')
const loadingScreenInfoText = document.getElementById('loadingInfo');
const debug = document.getElementById('debug');
const inboxTable = document.getElementById('inboxTable');

var firstTime = 1;

var pages = [document.getElementById('loadingScreen'),
	     mainTimeTable,
	     document.getElementById('homeWork'),
	     document.getElementById('settingsScreen'),
	     document.getElementById('events'),
	     debug,
	     document.getElementById('inbox'),
	     document.getElementById('firstTimeScreen')];

var openPage = 0;
showPage(0);

settings.loadSettings();

ipcRenderer.on('renderer:parseSettings', function(e, item) {
});

ipcRenderer.on('renderer:chPage', function(e, item) {
    showPage(item);
});

ipcRenderer.on('renderer:sessionInfo', function(e, item) {
    console.log('Receiving Session Data');

    const sessionID = document.getElementById('SessionString');
    sessionID.innerHTML = JSON.stringify(item.sessionId);
});

ipcRenderer.on('renderer:timegrid', function(e, item) {
    console.log(item);
});

ipcRenderer.on('renderer:status', function(e, item) {
    loadingScreenInfoText.innerHTML = item;
});

ipcRenderer.on('renderer:dateInfo', function(e, item) {
    console.log('Receiving Date Data');
    const sessionID = document.getElementById('SessionString');
    document.getElementById('DateString');
    sessionID.innerHTML = item;
});

ipcRenderer.on('renderer:timeTableInfo', function(e, timetableLastWeek, timetableThisWeek, timetableNextWeek) {
    console.log('Receiving and parsing Time Table Data');

    //timeTable.createTable(myClasses, timetableLastWeek, -1);
    //console.log(timetableThisWeek);
    //mainTimeTable = document.getElementById('timeTables');
    timetable.createTable(mainTimeTable, myClasses, timetableThisWeek, holidayData, 0);
    //timeTable.createTable(myClasses, timetableNextWeek, 1);
    //mainTimeTable = document.getElementById('TimeTable');

    if(firstTime === 0) {
	showPage(1);
	document.getElementById('bottomNavBar').style.display = 'block';
    }
});

ipcRenderer.on('renderer:homeWorkInfo', function(e, homeWorkData) {
    console.log('Receiving and parsing Home Work Data');
    homework.show(homeWorkTable, homeWorkData);
});

ipcRenderer.on('renderer:inbox', function(e, inboxData) {
    console.log('Receiving and parsing Home Work Data');
    inbox.show(inboxData);
});

ipcRenderer.on('renderer:holidayInfo', function(e, _holidayData) {
    holidayData = _holidayData;
});

async function saveSettings() {
    const schoolField = utils.sanitizeInput(document.getElementById('school').value);
    const userNameField = utils.sanitizeInput(document.getElementById('name').value);
    const serverURLField = utils.sanitizeInput(document.getElementById('server').value);
    const authCodeField = utils.sanitizeInput(document.getElementById('code').value);
    const settingsScreenAddMyClassInput = utils.sanitizeInput(document.getElementById("MyClassesInput").value);
    
    await settings.saveSettings(schoolField, userNameField, serverURLField, authCodeField, settingsScreenAddMyClassInput);
}

function showPage(id) {
    openPage = id;
    
    for(let i = 0; i < pages.length; i++) {
	pages[i].style.display = 'none';
    }
    pages[id].style.display = 'block';
}
