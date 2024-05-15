const electron = require('electron');
const {ipcRenderer} = electron;

const utils = require('../code/utils.js');
const md5 = require('../code/md5.js');
const timeTable = require('../code/table.js');
const homeWork = require('../code/homework.js');
const settings = require('../code/settings.js');
const inbox = require('../code/inbox.js');

const whookURL = '';

//var myClasses = ['MA_12_Ti', 'PH_12_Dr', 'CH_12_Vi', 'POWI_12_Ps_1', 'DE_12_Kö', 'SEM_12_Fo', 'KU_12_Bz', 'SN_12_Pn', 'SP_12_8'];
//const myClasses = ['MA_12_Sü_1', 'PH_12_Dr', 'CH_12_Vi', 'GE_12_Vt', 'DE_12_Hm_1', 'SEM_12_Sa', 'KU_12_Bz', 'PL_12_Wb', 'EN_12_Ml_1', 'SP_12_11'];
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
    timeTable.createTable(myClasses, timetableThisWeek, holidayData, 0);
    //timeTable.createTable(myClasses, timetableNextWeek, 1);
    //mainTimeTable = document.getElementById('TimeTable');

    if(firstTime === 0) {
	showPage(1);
	document.getElementById('bottomNavBar').style.display = 'block';
    }
});

ipcRenderer.on('renderer:homeWorkInfo', function(e, homeWorkData) {
    console.log('Receiving and parsing Home Work Data');
    homeWork.show(homeWorkTable, homeWorkData);
});

ipcRenderer.on('renderer:inbox', function(e, inboxData) {
    console.log('Receiving and parsing Home Work Data');
    inbox.show(inboxData);
});

ipcRenderer.on('renderer:holidayInfo', function(e, _holidayData) {
    holidayData = _holidayData;
    /*console.log(holidayData);
    var  currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    currentDate = `${year}${month}${day}`;
    //console.log(currentDate);
    holidayData.forEach(holiday => {
	if (holiday.startDate >= currentDate) {
	    console.log(holiday);
	}
    });*/
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
