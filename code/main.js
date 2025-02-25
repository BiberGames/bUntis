// main.js

// Modules to control application life and create native browser window
// Electron //
import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron';
import electron from 'electron';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';
import fs from "fs";
import Store from 'electron-store';

import { utils } from './utils.js';
//import { communicationBridge } from './communicationBridge.js'

var mainWindow = '';
var tempData = [];

import { WebUntisSecretAuth } from 'webuntis';
import { authenticator } from 'otplib';

const UpdatedUserDataPath = app.getPath('userData') + "/config/default";

var canReload = true;

const errorWait = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
	slashes: true
    }));
    
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    const args = process.argv;
    if (args.includes('--newtimetable')) {
        console.log("Using new timetable");
        mainWindow.webContents.once('did-finish-load', () => {
            mainWindow.webContents.send('renderer:useNewTable', true);
        });
    }
    else if(!args.includes('--newtimetable')) {
	console.log("Using old timetable");
        mainWindow.webContents.once('did-finish-load', () => {
            mainWindow.webContents.send('renderer:useNewTable', false);
        });
    }
}

app.on('ready', () => {
    createWindow();
    loadServer();
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
	app.setPath('userData', app.getPath('userData') + "/config/default");
	createWindow();
	loadServer();
    }
})

app.on("new-window", (event, url) => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('server:saveUserData', async (event, key, saveData) => {
    const data = new Store();
    data.set(key, saveData);
});

ipcMain.handle('server:readUserData', async (event, key) => {
    const loginData = new Store();
    return loginData.get(key);
});

ipcMain.handle('server:restart', async () => {
    // if(canReload === false) return;

    canReload = false;
    await mainWindow.webContents.reload();
    loadServer();
});

async function sendStatus(message) {
    mainWindow.send('renderer:status', message);
    console.log(message);
}

async function getData(untisMethod, errorMessage) {
    try {
        return await untisMethod();
    } catch (e) {
        await sendStatus(errorMessage);
        console.error(e);
        await new Promise(r => setTimeout(r, errorWait));
        return null; // Return null or an appropriate fallback value in case of error
    }
}

async function loadServer() {
    app.setPath('userData', UpdatedUserDataPath);
    const loginData = new Store();
    const password = loginData.get('login');
    mainWindow.send('renderer:parseSettings', password);
    
    const tempData = JSON.parse(password);
    await getWebData(tempData);
}

async function getWebData(loginData) {
    const untis = new WebUntisSecretAuth(loginData[0], loginData[1], loginData[2], loginData[3], 'bUntis Client', authenticator);
    
    await sendStatus("Logging in");
    if (!await loginUntis(untis)) return;
    
    const weekRange = getWeekRange();
    if (!weekRange) return;
    
    const [weekStart, weekEnd] = weekRange;

    await sendStatus("Receiving Timegrid");
    const timegrid = await getData(() => untis.getTimegrid(), "Error Receiving Timegrid");
    if (!timegrid) return;
    
    await sendStatus("Receiving Timetable");
    const timetableThisWeek = await getData(() => untis.getOwnClassTimetableForRange(weekStart, weekEnd), "Error Receiving Timetable");
    if (!timetableThisWeek) return;
    
    await sendStatus("Receiving Inbox");
    const inbox = await getData(() => untis.getInbox(), "Error Receiving Inbox");
    if (!inbox) return;

    await sendStatus("Receiving Homework");
    weekEnd.setDate(weekEnd.getDate() + 7);
    const homework = await getData(() => untis.getHomeWorksFor(new Date(), weekEnd), "Error Receiving Homework");
    if (!homework) return;
    
    await sendStatus("Receiving Absences");
    const absences = await getData(() => untis.getAbsentLesson(new Date(new Date().getFullYear() -1, 0, 1), new Date()), "Error Receiving Absences");
    if (!absences) return;

    await mainWindow.send('renderer:sessionInfo', untis.sessionInformation);
    await mainWindow.send('renderer:timegrid', timegrid);
    await mainWindow.send('renderer:timeTableInfo', timetableThisWeek);
    await mainWindow.send('renderer:homeWorkInfo', homework);
    await mainWindow.send('renderer:dateInfo', weekStart);
    await mainWindow.send('renderer:inbox', inbox);
    await mainWindow.send('renderer:absences', absences);
    await mainWindow.send('renderer:done', 'done');
    
    await sendStatus("Parsing data");
    await sendStatus("Logging out");
    await untis.logout();
    await sendStatus("Done");
    canReload = true;
}

function getWeekRange() {
    try {
        const weekStart = utils.getFirstDayOfWeek();
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 4);
        return [weekStart, weekEnd];
    } catch (e) {
        sendStatus("Error Setting Date");
        console.error(e);
        return null;
    }
}

async function loginUntis(untis) {
    try {
        await untis.login();
        return true;
    } catch (e) {
        sendStatus("Error During Login");
        console.error(e);
        await new Promise(r => setTimeout(r, errorWait));
        return false;
    }
}
