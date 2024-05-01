// main.js

// Modules to control application life and create native browser window
// Electron //
const { app, BrowserWindow, ipcMain } = require('electron');
const electron = require('electron');
const path = require('path')
const { subDays, endOfMonth } = require('date-fns');
const url = require('url');
const fs = require("fs");
const keytar = require('keytar');
const md5 = require('../code/md5.js');

var mainWindow = '';
var tempData = [];

//process.env.NODE_ENV = 'development';
// ELECTRON //

// UNTIS //
const { WebUntisSecretAuth } = require('webuntis');
const { authenticator } = require('otplib');
// UNTIS //

// DATA //
var classes = '';
var sessionInfo = '';
var classID = 901;
var timetableLastWeak = '';
var timetableThisWeak = '';
var timetableNextWeak = '';
var homework = '';
var holidays = '';
var timegrid = '';

//var subjects = ''
// DATA //

// CONSOLE //
var nodeConsole = require('console');
var vsCodeDebugConsole = new nodeConsole.Console(process.stdout, process.stderr);
// CONSOLE //


const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
	//885 x 827
	width: 470,
	height: 650,
	webPreferences: {
    	    nodeIntegration: true,
	    contextIsolation: false
	}
    })
    
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
	pathname: path.join(__dirname, '../ui/index.html'),
	protocol: 'file:',
	slashes:true
    }));
    
    // Open the DevTools.
    //mainWindow.webContents.openDevTools()
}

app.on('ready', () => {
    createWindow();
    //getWebData();
    loadServer();
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
    {
	createWindow();
	loadServer();
	//getWebData();
    }
})

app.on("new-window", (event, url) => {
    createWindow();
    //getWebData();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

function getFirstDayOfWeek() 
{
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    
    // If today is Sunday or Saturday, advance to the next week
    if (currentDay === 0 || currentDay === 6) {
	const daysUntilMonday = currentDay === 0 ? 1 : 2;
	today.setDate(today.getDate() + daysUntilMonday);
    }
    
    // Calculate the Monday of the current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    
    return monday;
}
ipcMain.handle('server:save', async (event, saveData) => {
    vsCodeDebugConsole.log("Saving Settings");
    //vsCodeDebugConsole.log(saveData);
    
    keytar.setPassword('bUntis', 'login', JSON.stringify(saveData))
	.then(() => {
            vsCodeDebugConsole.log('Password saved successfully');
	})
	.catch((err) => {
            vsCodeDebugConsole.error('Error saving password:', err);
	});
    
    app.relaunch();
    app.exit();
});

ipcMain.handle('server:restart', async () => {
    app.relaunch();
    app.exit();
});

async function loadServer() {
    keytar.getPassword('bUntis', 'login')
	.then((password) => {
	    if (password) {
		mainWindow.send('renderer:parseSettings', password);
		
		//vsCodeDebugConsole.log('Password retrieved successfully:', password);
		password = JSON.parse(password);
		//vsCodeDebugConsole.log('Password retrieved successfully:', password);
		getWebData(password);
		//vsCodeDebugConsole.log(password[0] + ' ' + password[1] + ' ' + password[3] + ' ' + password[2]);
	    } else {
		vsCodeDebugConsole.log('Password not found');
	    }
	}).catch((err) => {
	    vsCodeDebugConsole.error('Error retrieving password:', err);
	});
}

async function getWebData(loginData) {
    vsCodeDebugConsole.log("untisApi;");
    
    const untis = new WebUntisSecretAuth(loginData[0], loginData[1], loginData[2], loginData[3], 'custom-identity', authenticator);
    vsCodeDebugConsole.log("Logging in.");
    
    
    mainWindow.send('renderer:status', 'Logging in.');
    await untis.login();
    
    sessionInfo = untis.sessionInformation;
    classID = sessionInfo.klasseId;
    
    mainWindow.send('renderer:status', 'Setting date.');
    
    weekStart = new Date();
    weekEnd = new Date();
    
    weekStart = getFirstDayOfWeek();
    if(weekStart.getDate() + 4 > 30) {
	weekEnd.setMonth(weekStart.getMonth() + 1);
    }
    weekEnd.setDate(weekStart.getDate() + 4);

    // Add next year check here.
    
    vsCodeDebugConsole.log(weekStart);
    vsCodeDebugConsole.log(weekEnd);

    mainWindow.send('renderer:status', 'Recieving Timegrid');
    timegrid = await untis.getTimegrid();
    //vsCodeDebugConsole.log(timeGrid);
    
    mainWindow.send('renderer:status', 'Recieving Timetable.');
    //timetableLastWeak = await untis.getOwnClassTimetableForRange(weekStart, weekEnd);
    timetableThisWeak = await untis.getOwnClassTimetableForRange(weekStart, weekEnd);

    //mainWindow.send('renderer:status', 'Recieving inbox');
    //var inbox = await untis.getInbox();
    //vsCodeDebugConsole.log(inbox);

    mainWindow.send('renderer:status', 'Recieving Holidays');
    holidays = await untis.getHolidays();
    //vsCodeDebugConsole.log(holidays);
    
    //mainWindow.send('renderer:status', 'Recieving subjects.');
    //subjects = await untis.Timegrid(weekStart, );
    
    mainWindow.send('renderer:status', 'Recieving Homework.');
    
    if(weekEnd.getDate() + 4 > 30)
	weekEnd.setMonth(weekStart.getMonth() + 1);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    homework = await untis.getHomeWorksFor(weekStart, weekEnd);
    
    if(weekStart.getDate() + 7 > 30)
	weekEnd.setMonth(weekStart.getMonth() + 1);
    weekStart.setDate(weekStart.getDate() + 7);
    
    timetableNextWeak = await untis.getOwnClassTimetableForRange(weekStart, weekEnd);
    
    vsCodeDebugConsole.log(weekStart);
    vsCodeDebugConsole.log(weekEnd);
    
    vsCodeDebugConsole.log('Sending data!');
    await mainWindow.send('renderer:sessionInfo', sessionInfo);
    await mainWindow.send('renderer:holidayInfo', holidays);
    await mainWindow.send('renderer:timegrid', timegrid);
    await mainWindow.send('renderer:timeTableInfo', 'timetableLastWeak', timetableThisWeak, timetableNextWeak);
    //mainWindow.send('renderer:subjectsData', subjects);
    await mainWindow.send('renderer:homeWorkInfo', homework);
    await mainWindow.send('renderer:dateInfo', weekStart);
    //mainWindow.send('renderer:inbox', inbox);
    
    mainWindow.send('renderer:status', 'Parsing data.');
    
    vsCodeDebugConsole.log("Logging out.");
    await untis.logout();
}
