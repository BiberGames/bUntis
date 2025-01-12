const { ipcRenderer } = require('electron');

import { platformClient } from './platformClient.js';
import { utils } from './utils.js';
import { timetable } from './table.js';
import { homework } from './homework.js';
import { settings } from './settings.js';
import { inbox } from './inbox.js';
import { absences} from './absences.js';
import { ui } from './ui.js';

var mainTimeTable = document.getElementById('timeTables');
const homeWorkTable = document.getElementById('homeWorkTable');
const loadingScreenInfoText = document.getElementById('loadingInfo');
const debug = document.getElementById('debug');
const inboxTable = document.getElementById('inboxTable');

var timeGridData = [];

var firstTime = await platformClient.invoke('server:readUserData', 'setup');
if(firstTime) {
    ui.showPage(0);
    settings.loadSettings();
}
else ui.showPage(7);
/*
ipcRenderer.on('renderer:showProfiles', function(e, item) {
    //ui.showPage(8);
    profiles.createUIList(item);
    console.log('More than one profile detected!: ', profiles.length - 1);
});

ipcRenderer.on('renderer:printClient', function(e, item) {
    console.log(item);
});

ipcRenderer.on('renderer:parseSettings', function(e, item) {
});
*/
ipcRenderer.on('renderer:chPage', function(e, item) {
    ui.showPage(item);
});

ipcRenderer.on('renderer:sessionInfo', function(e, item) {
    console.log('Receiving Session Data');

    const sessionID = document.getElementById('SessionString');
    sessionID.innerHTML = JSON.stringify(item.sessionId);
});

ipcRenderer.on('renderer:timegrid', function(e, item) {
    timeGridData = item;
    // console.log(item);
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

ipcRenderer.on('renderer:timeTableInfo', function(e, timetableThisWeek) {
    console.log('Receiving and parsing Time Table Data');

    timetable.createTable(timetableThisWeek, timeGridData, 0);

});

ipcRenderer.on('renderer:homeWorkInfo', function(e, homeWorkData) {
    console.log('Receiving and parsing Home Work Data');

    homework.show(homeWorkData);
});

ipcRenderer.on('renderer:inbox', function(e, inboxData) {
    console.log('Receiving and parsing Home Work Data');

    inbox.show(inboxData);
});
/*
ipcRenderer.on('renderer:holidayScreen', function(e) {
    document.getElementsByClassName('loader')[0].style.display = 'none';
    document.getElementsByClassName('loader-holiday')[0].style.display = 'block';
    document.getElementById('loadingInfo').innerHTML = '<br><br><br><br><br><br>' + document.getElementById('loadingInfo').innerHTML;
});
*/
ipcRenderer.on('renderer:absences', function(e, absencesData) {
    console.log('Receiving and parsing absences');

    absences.show(absencesData);
});

ipcRenderer.on('renderer:reload', function(e) {
    ui.restart();
});

ipcRenderer.on('renderer:done', function(e) {
    if(firstTime) {
	ui.showPage(1);
	document.getElementById('bottomNavBar').style.display = 'block';
    }
});
