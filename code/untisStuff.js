const electron = require('electron');
const { ipcRenderer } = require('electron');

import { utils } from '../code/utils.js';
//import md5 from'../code/md5.js';
import { timetable } from '../code/table.js';
import { homework } from '../code/homework.js';
import { settings } from '../code/settings.js';
import { inbox } from '../code/inbox.js';
import { ui } from '../code/ui.js';

const whookURL = '';

var myClasses = '';
var holidayData = '';

var mainTimeTable = document.getElementById('timeTables');
const homeWorkTable = document.getElementById('homeWorkTable')
const loadingScreenInfoText = document.getElementById('loadingInfo');
const debug = document.getElementById('debug');
const inboxTable = document.getElementById('inboxTable');

var firstTime = await ipcRenderer.invoke('server:readDataToFile', 'setup');

settings.loadSettings();

if(firstTime)
    ui.showPage(0);
else
    ui.showPage(7);

ipcRenderer.on('renderer:parseSettings', function(e, item) {
});

ipcRenderer.on('renderer:chPage', function(e, item) {
    ui.showPage(item);
});

ipcRenderer.on('renderer:sessionInfo', function(e, item) {
    console.log('Receiving Session Data');

    const sessionID = document.getElementById('SessionString');
    sessionID.innerHTML = JSON.stringify(item.sessionId);
});

ipcRenderer.on('renderer:timegrid', function(e, item) {
    //console.log(item);
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
    timetable.createTable(timetableThisWeek, 0);
    //timeTable.createTable(myClasses, timetableNextWeek, 1);
    //mainTimeTable = document.getElementById('TimeTable');

    if(firstTime) {
	ui.showPage(1);
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
