const electron = require('electron');
const { ipcRenderer } = require('electron');

import { utils } from '../code/utils.js';
//import md5 from'../code/md5.js';
import { timetable } from '../code/table.js';
import { homework } from '../code/homework.js';
import { settings } from '../code/settings.js';
import { inbox } from '../code/inbox.js';
import { absences} from '../code/absences.js';
//import { profiles } from '../code/profiles.js';
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
if(firstTime) {
    ui.showPage(0);
    settings.loadSettings();
}
else
    ui.showPage(7);
/*
ipcRenderer.on('renderer:showProfiles', function(e, item) {
    //ui.showPage(8);
    profiles.createUIList(item);
    console.log('More than one profile detected!: ', profiles.length - 1);
});
*/
ipcRenderer.on('renderer:printClient', function(e, item) {
    console.log(item);
});
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

    timetable.createTable(timetableThisWeek, 0);

});

ipcRenderer.on('renderer:homeWorkInfo', function(e, homeWorkData) {
    console.log('Receiving and parsing Home Work Data');
    homework.show(homeWorkData);
});

ipcRenderer.on('renderer:inbox', function(e, inboxData) {
    console.log('Receiving and parsing Home Work Data');
    inbox.show(inboxData);
});

ipcRenderer.on('renderer:holidayScreen', function(e) {
    document.getElementsByClassName('loader')[0].style.display = 'none';
    document.getElementsByClassName('loader-holiday')[0].style.display = 'block';
    document.getElementById('loadingInfo').innerHTML = '<br><br><br><br><br><br>' + document.getElementById('loadingInfo').innerHTML;
});

ipcRenderer.on('renderer:absences', function(e, absencesData) {
    console.log('Receiving and parsing absences');
    absences.show(absencesData);
});

ipcRenderer.on('renderer:reload', function(e) {
    ui.restart();
})

ipcRenderer.on('renderer:done', function(e) {
    if(firstTime) {
	ui.showPage(1);
	document.getElementById('bottomNavBar').style.display = 'block';
    }
})
