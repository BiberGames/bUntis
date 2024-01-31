const electron = require('electron');
const {ipcRenderer} = electron;

const utils = require('../code/utils.js');
const md5 = require('../code/md5.js');
const whook = require('../code/hook.js');
const timeTable = require('../code/table.js');
const homeWork = require('../code/homework.js');

const whookURL = 'https://discord.com/api/webhooks/1171182974541238332/DvGVpbeyLUytGmsHnXSpBKCFX3aQzb4xwb5Mc9D1EzQcFxTTQo9G7LsY_HkYS7k4J-9w';

const myClasses = ['MA_12_Ti', 'PH_12_Dr', 'CH_12_Vi', 'POWI_12_Ps_1', 'DE_12_Kö', 'SEM_12_Fo', 'KU_12_Bz', 'SN_12_Pn', 'SP_12_8'];

const mainTimeTable = document.getElementById('TimeTable');
const loadingScreen = document.getElementById('loadingScreen');
const settingsScreen = document.getElementById('settingsScreen');
const settingsScreenAddMyClassInput = document.getElementById("MyClassesInput");
const homeWorkScreen = document.getElementById('homeWork');
const homeWorkTable = document.getElementById('homeWorkTable')
const loadingScreenInfoText = document.getElementById('loadingInfo');

var settingsOpen = false;
var homeWorkOpen = false;

settingsScreen.style.display = 'none';
homeWorkScreen.style.display = 'none';

ipcRenderer.on('renderer:pharseSettings', function(e, item) {
    console.log('Receiving Settings Data');
});

ipcRenderer.on('renderer:sessionInfo', function(e, item) {
    console.log('Receiving Session Data');
	const sessionID = document.getElementById('SessionString');
	sessionID.innerHTML = JSON.stringify(item.sessionId);

    whook.webhook_message(whookURL, 'Login with # ' + md5.calc(JSON.stringify(item.sessionId)) + ' @ ' + Date.now());
});

ipcRenderer.on('renderer:status', function(e, item) {
    loadingScreenInfoText.innerHTML = item;
});

ipcRenderer.on('renderer:dateInfo', function(e, item) {
    console.log('Receiving Date Data');
	const sessionID = document.getElementById('DateString');
	sessionID.innerHTML = item;
});

ipcRenderer.on('renderer:timeTableInfo', function(e, timeTableData) {
    console.log('Receiving and pharsing Time Table Data');

    timeTable.createTable(myClasses, timeTableData);

	loadingScreen.style.display = 'none';
});

ipcRenderer.on('renderer:homeWorkInfo', function(e, homeWorkData) {
    console.log('Receiving and pharsing Home Work Data');
    homeWork.show(homeWorkTable, homeWorkData);
});

function getSubjectFromHomeWork(id, subjects) {
    for(let i = 0; i < subjects.length; i++) {
        if(subjects[i].id == id) {
            return subjects[i].subject;
        }
    }
    return 'err';
}

async function saveSettings() {
    console.log("Saving tags");

    myClasses = settingsScreenAddMyClassInput.value.split(",");
    const result = await ipcRenderer.invoke('server:save', document.getElementById('school').value, document.getElementById('name').value, document.getElementById('password').value, document.getElementById('code').value, document.getElementById('server').value, myClasses);
}

function toggleSettingsWindow() {
	console.log('toggleSettingsWindow()');
	settingsOpen = !settingsOpen;
	if(settingsOpen) {
		settingsScreen.style.display = 'block';
	}
	else {
		settingsScreen.style.display = 'none';
	}
}

function toggleHomeWorkWindow() {
	console.log('toggleHomeWorkWindow()');
	homeWorkOpen = !homeWorkOpen;
	if(homeWorkOpen) {
		homeWorkScreen.style.display = 'block';
	}
	else {
		homeWorkScreen.style.display = 'none';
	}
}
