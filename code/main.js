// main.js

// Modules to control application life and create native browser window
// Electron //
import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron';
import electron from 'electron';
import path from 'path';
import { dirname } from 'path';
import { subDays, endOfMonth } from 'date-fns';
import url from 'url';
import { fileURLToPath } from 'url';
import fs from "fs";
import Store from 'electron-store';
import { utils } from '../code/utils.js';

var mainWindow = '';
var tempData = [];

import { WebUntisSecretAuth } from 'webuntis';
import { authenticator } from 'otplib';

var classes = '';
var sessionInfo = '';
var classID = '';
var timetableLastWeak = '';
var timetableThisWeak = '';
var timetableNextWeak = '';
var homework = '';
var inbox = '';
var holidays = '';
var timegrid = '';
var absences = '';

var canReload = true;

var errorWait = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import nodeConsole from 'console';
var vsCodeDebugConsole = new nodeConsole.Console(process.stdout, process.stderr);

const isMac = process.platform === 'darwin'
const template = [
    ...(isMac
	? [{
            label: app.name,
            submenu: [
		{ role: 'about' },
		{ type: 'separator' },
		{ role: 'services' },
		{ type: 'separator' },
		{ role: 'hide' },
		{ role: 'hideOthers' },
		{ role: 'unhide' },
		{ type: 'separator' },
		{ role: 'quit' }
            ]
	}]
	: []),
    // { role: 'fileMenu' }
    {
	label: 'File',
	submenu: [
	    {
		label: 'Reload',
		accelerator: 'CmdOrCtrl+r',
		role: 'reloadClient',
		click: async () => {
		    await mainWindow.send('renderer:reload', 0);
		}
	    },
	    { type: 'separator' },
	    isMac ? { role: 'close' } : { role: 'quit' }
	]
    },
    // { role: 'viewMenu' }
    {
	label: 'View',
	submenu: [
	    {
		label: 'Timetable',
		accelerator: 'CmdOrCtrl+1',
		role: 'page0',
		click: async () => {
		    await mainWindow.send('renderer:chPage', 1);
		}
	    },
	    {
		label: 'Homework',
		accelerator: 'CmdOrCtrl+2',
		role: 'page1',
		click: async () => {
		    await mainWindow.send('renderer:chPage', 2);
		}
	    },
	    {
		label: 'Inbox',
		accelerator: 'CmdOrCtrl+3',
		role: 'page2',
		click: async () => {
		    await mainWindow.send('renderer:chPage', 6);
		}
	    },
	    {
		label: 'Absences',
		accelerator: 'CmdOrCtrl+4',
		role: 'page3',
		click: async () => {
		    await mainWindow.send('renderer:chPage', 5);
		}
	    },
	    { type: 'separator' },
	    {
		label: 'Settings',
		accelerator: 'CmdOrCtrl+5',
		role: 'page4',
		click: async () => {
		    await mainWindow.send('renderer:chPage', 4);
		}
	    },
	    { role: 'toggleDevTools' },
	    {
		label: 'Page 6',
		accelerator: 'CmdOrCtrl+6',
		role: 'page6',
		click: async () => {
		    await mainWindow.send('renderer:chPage', 6);
		}
	    },
	    {
		label: 'Page 7',
		accelerator: 'CmdOrCtrl+7',
		role: 'page7',
		click: async () => {
		    await mainWindow.send('renderer:chPage', 7);
		}
	    },
	    {
		label: 'Page 8',
		accelerator: 'CmdOrCtrl+8',
		role: 'page7',
		click: async () => {
		    await mainWindow.send('renderer:chPage', 8);
		}
	    }
	]
    },
    {
	role: 'help',
	submenu: [
	    {
		label: 'Learn More',
		click: async () => {
		    await shell.openExternal('https://codeberg.org/BiberGames/bUntis');
		}
	    },
	    {
		label: 'Wiki',
		click: async () => {
		    await shell.openExternal('https://codeberg.org/BiberGames/bUntis/wiki');
		}
	    }
	]
    }
]

const createWindow = () => {
    mainWindow = new BrowserWindow({
	width: 470,
	height: 650,
	webPreferences: {
	    contextIsolation: false,
	    nodeIntegration: true
	}
    });

    mainWindow.loadURL(url.format({
	pathname: path.join(__dirname, '../ui/index.html'),
	protocol: 'file:',
	slashes:true
    }));

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
    createWindow();
    loadServer();
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
	createWindow();
	loadServer();
    }
})

app.on("new-window", (event, url) => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

ipcMain.handle('server:saveDataToFile', async (event, key, saveData) => {
    const data = new Store();
    data.set(key, saveData);
});

ipcMain.handle('server:readDataToFile', async (event, key) => {
    const loginData = new Store();
    return loginData.get(key);
});

ipcMain.handle('server:removeDataToFile', async (event, key) => {
    const loginData = new Store();
    return loginData.delete(key);
});

ipcMain.handle('server:restart', async () => {
    if(canReload === false)
	return;

    canReload = false;
    mainWindow.webContents.reload();
    getWebData(tempData);
});

function loadServer() {
    app.setPath ('userData', app.getPath ('userData') + "/config/default");
    const loginData = new Store();
    const password = loginData.get('login');
    
    mainWindow.send('renderer:parseSettings', password);
    
    tempData = JSON.parse(password)
    getWebData(tempData);
}

async function getWebData(loginData) {
    vsCodeDebugConsole.log("untisApi;");

    const untis = new WebUntisSecretAuth(loginData[0], loginData[1], loginData[2], loginData[3], 'bUntis Client', authenticator);
    vsCodeDebugConsole.log("Logging in.");
    
    mainWindow.send('renderer:status', 'Logging in.');
    await untis.login();

    /*vsCodeDebugConsole.log(utils.getLatestSchoolyear);
    if(!utils.getLatestSchoolyear) {
	mainWindow.send('renderer:status', 'No school year defined...');
	await mainWindow.send('renderer:holidayScreen');
	return;
    }*/
    
    sessionInfo = untis.sessionInformation;
    classID = sessionInfo.klasseId;
    
    mainWindow.send('renderer:status', 'Setting date.');
    try {
	var weekStart = new Date();
	var weekEnd = new Date(weekStart);
	    
	weekStart = utils.getFirstDayOfWeek();
	weekEnd.setDate(weekStart.getDate() + 4);
    }
    catch(e) {
	mainWindow.send('renderer:status', 'Error Setting Date.');
	vsCodeDebugConsole.error(e);
	await new Promise(r => setTimeout(r, errorWait));
	return;
    }

    vsCodeDebugConsole.log(weekStart);
    vsCodeDebugConsole.log(weekEnd);

    mainWindow.send('renderer:status', 'Recieving Timegrid');
    try {
	timegrid = await untis.getTimegrid();
    }
    catch(e) {
	mainWindow.send('renderer:status', 'Error Recieving Timegrid.');
	vsCodeDebugConsole.error(e);
	await new Promise(r => setTimeout(r, errorWait));
	return;
    }

    mainWindow.send('renderer:status', 'Recieving Timetable.');
    try {
	timetableThisWeak = await untis.getOwnClassTimetableForRange(weekStart, weekEnd);
    }
    catch(e) {
	mainWindow.send('renderer:status', 'Error Recieving Timetable.');
	vsCodeDebugConsole.error(e);
	await new Promise(r => setTimeout(r, errorWait));
	return;
    }
    
    mainWindow.send('renderer:status', 'Recieving Inbox.');
    try {
	inbox = await untis.getInbox();
    }
    catch(e) {
	mainWindow.send('renderer:status', 'Error Recieving Inbox.');
	vsCodeDebugConsole.error(e);
	await new Promise(r => setTimeout(r, errorWait));
	return;
    }

    //mainWindow.send('renderer:status', 'Recieving Holidays');
    //holidays = await untis.getHolidays();
    //vsCodeDebugConsole.log(holidays);
    
    mainWindow.send('renderer:status', 'Recieving Homework.');
    weekEnd.setDate(weekEnd.getDate() + 7);
    try {
	homework = await untis.getHomeWorksFor(new Date(), weekEnd);
    }
    catch(e) {
	mainWindow.send('renderer:status', 'Error Recieving Homework.');
	vsCodeDebugConsole.error(e);
	await new Promise(r => setTimeout(r, errorWait));
	return;
    }

    mainWindow.send('renderer:status', 'Recieving Absences');
    try {
	absences = await untis.getAbsentLesson(new Date(new Date().getFullYear(), 0, 1), new Date());
    }
    catch(e) {
	mainWindow.send('renderer:status', 'Error Recieving Absences.');
	vsCodeDebugConsole.error(e);
	await new Promise(r => setTimeout(r, errorWait));
	return;
    }

    vsCodeDebugConsole.log(weekStart);
    vsCodeDebugConsole.log(weekEnd);
    
    vsCodeDebugConsole.log('Sending data!');
    await mainWindow.send('renderer:sessionInfo', sessionInfo);
    await mainWindow.send('renderer:timegrid', timegrid);
    await mainWindow.send('renderer:timeTableInfo', 'timetableLastWeak', timetableThisWeak, timetableNextWeak);
    await mainWindow.send('renderer:homeWorkInfo', homework);
    await mainWindow.send('renderer:dateInfo', weekStart);
    await mainWindow.send('renderer:inbox', inbox);
    await mainWindow.send('renderer:absences', absences);
    await mainWindow.send('renderer:done', 'done');
    
    mainWindow.send('renderer:status', 'Parsing data.');
    
    vsCodeDebugConsole.log("Logging out.");
    await untis.logout();
    mainWindow.send('renderer:status', 'Done.');
    canReload = true;
}
