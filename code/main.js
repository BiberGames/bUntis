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

var mainWindow = ''
var tempData = [];

//process.env.NODE_ENV = 'development';
// ELECTRON //

// UNTIS //
const { WebUntisSecretAuth } = require('webuntis')
const { authenticator } = require('otplib')
// UNTIS //

// DATA //
var classes = ''
var sessionInfo = ''
var classID = 901
var timetable = ''
var homework = ''
//var subjects = ''
// DATA //

// CONSOLE //
var nodeConsole = require('console');
var vsCodeDebugConsole = new nodeConsole.Console(process.stdout, process.stderr);
// CONSOLE //


const createWindow = () => {
	// Create the browser window.
	mainWindow = new BrowserWindow({
    width: 620,
    height: 560,
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
	getWebData();
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0)
	{
		createWindow();
		getWebData();
	}
})

app.on("new-window", (event, url) => {
	createWindow();
	getWebData();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function getFirstDayOfWeek(d) 
{
	const date = new Date(d);
	const dayOfWeek = date.getDay();

	const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

	date.setDate(date.getDate() - daysToSubtract);

	if (dayOfWeek === 0 || dayOfWeek === 6)
	{
	  date.setDate(date.getDate() + 1);
	}
  
	return date;
}

const userDataPath = (electron.app || electron.remote.app).getPath('userData');
const savePath = path.join(userDataPath, 'save.json')

ipcMain.handle('server:save', async (event, school, username, code, server, classes) => {
	vsCodeDebugConsole.log("Saving Settings");
	const save = [];
	save.push(school);
	save.push(username);
	save.push(code);
	save.push(server);
	save.push(classes);

	var hash = md5.calc(JSON.stringify(save));
	vsCodeDebugConsole.log(hash);

	//keytar.setPassword('bUntis', 'exampleUser', 'examplePassword');

	//fs.writeFileSync(savePath, JSON.stringify(save), 'utf-8');

	vsCodeDebugConsole.log(savePath);

	app.relaunch();
	app.exit();
});

async function readSavedSettings()
{
    vsCodeDebugConsole.log(savePath);

	let res = fs.existsSync(savePath);
	if (res)
	{
		let dt = fs.readFileSync(savePath);
		tempData = JSON.parse(dt);
	}
}

async function getWebData() {
	vsCodeDebugConsole.log("untisApi;");
	await readSavedSettings();
	//vsCodeDebugConsole.log(tempData);
	const untis = new WebUntisSecretAuth('gymnordenham', 'benjamin.frischkorn', 'FFI7G4D5255MCTLX', 'arche.webuntis.com', 'custom-identity', authenticator);
	//const untis = new WebUntisSecretAuth(tempData[0], tempData[1], tempData[3], tempData[4], 'custom-identity', authenticator);
	//vsCodeDebugConsole.log("Logging in.");
    
    mainWindow.send('renderer:pharseSettings', tempData);
	tempData = [];

	mainWindow.send('renderer:status', 'Logging in.');
	await untis.login();

	sessionInfo = untis.sessionInformation;
	classID = sessionInfo.klasseId;

	mainWindow.send('renderer:status', 'Setting date.');
	var testDate = new Date();
	testDate.setDate(testDate.getDate() + 1);

	//mainWindow.send('renderer:status', 'Recieving classes.');
	//classes = await untis.getClasses();

	weekStart = new Date();
	weekStart.setDate(weekStart.getDate());
	weekEnd = new Date();
	weekStart = getFirstDayOfWeek(weekStart);
	weekEnd.setDate(weekStart.getDate() + 4);
	
	vsCodeDebugConsole.log(weekStart);
	vsCodeDebugConsole.log(weekEnd);

	mainWindow.send('renderer:status', 'Recieving timetable.');
	timetable = await untis.getOwnClassTimetableForRange(weekStart, weekEnd);

	//mainWindow.send('renderer:status', 'Recieving subjects.');
	//subjects = await untis.Timegrid(weekStart, );

	mainWindow.send('renderer:status', 'Recieving homework.');
	homework = await untis.getHomeWorksFor(weekStart, weekEnd);


	vsCodeDebugConsole.log('Sending data!');
	mainWindow.send('renderer:sessionInfo', sessionInfo);
	mainWindow.send('renderer:timeTableInfo', timetable);
	//mainWindow.send('renderer:subjectsData', subjects);
	mainWindow.send('renderer:homeWorkInfo', homework);
	mainWindow.send('renderer:dateInfo', weekStart);

	mainWindow.send('renderer:status', 'Pharsing data.');

	vsCodeDebugConsole.log("Logging out.");
	await untis.logout();
}
