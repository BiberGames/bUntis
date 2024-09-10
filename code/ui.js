import { utils } from './utils.js';
import { settings } from './settings.js';
const { ipcRenderer, shell } = require('electron');

const ui = {};

global.pages = [document.getElementById('loadingScreen'),
		document.getElementById('timeTables'),
		document.getElementById('homeWork'),
		document.getElementById('settingsScreen'),
		document.getElementById('events'),
		debug,
		document.getElementById('inbox'),
		document.getElementById('firstTimeScreen'),
		document.getElementById('profileScreen'),
		];

global.openPage = 0;

ui.showPage = function(id) {
    ui.openPage = id;
    
    for(let i = 0; i < global.pages.length; i++) {
	if(global.pages[i])
	    global.pages[i].style.display = 'none';
    }
    if(global.pages[id])
	global.pages[id].style.display = 'block';
}

ui.restart = function() {
    ipcRenderer.invoke('server:restart');
}

ui.openURL = async function(URL) {
    await shell.openExternal(URL);
}

ui.saveSettings = async function() {
    const schoolField = utils.sanitizeInput(document.getElementById('school').value);
    const userNameField = utils.sanitizeInput(document.getElementById('name').value);
    const serverURLField = utils.sanitizeInput(document.getElementById('server').value);
    const authCodeField = utils.sanitizeInput(document.getElementById('code').value);
    const settingsScreenAddMyClassInput = utils.sanitizeInput(document.getElementById("MyClassesInput").value);
    
    await settings.saveSettings(schoolField, userNameField, serverURLField, authCodeField, settingsScreenAddMyClassInput);
}

ui.startProfile = function(name) {}
ui.addProfileButton = function(name) {}

export { ui };
