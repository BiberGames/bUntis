//import md5 from '../code/md5.js';
import { utils } from '../code/utils.js';
//import Store from 'electron-store';
//const store = require('electron-store');
//const keytar = require('keytar');

const settings = {};

settings.saveSettings = async function(_school, _username, _server, _code, _classes) {
    var saveDataServer = [];
    var classes = [];

    saveClient(_classes, "");
    
    saveDataServer.push(_school);
    saveDataServer.push(_username);
    saveDataServer.push(_code);
    saveDataServer.push(_server);

    const result = await ipcRenderer.invoke('server:save', saveDataServer);
}

function saveClient(saveData, hook) {
    keytar.setPassword('bUntis', 'classes', saveData)
	.then(() => {
            console.log('Password saved successfully');
	})
	.catch((err) => {
            console.error('Error saving password:', err);
	});

    keytar.setPassword('bUntis', 'setup', "1")
	.then(() => {
            console.log('Password saved successfully');
	})
	.catch((err) => {
            console.error('Error saving password:', err);
	});
}

settings.loadSettings = function() {
    let data;
    keytar.getPassword('bUntis', 'setup')
	.then((password) => {
	    if (password) {
		firstTime = 0;
		//showPage(6);
	    } else {
		showPage(7);
		console.log('Password not found');
	    }
	}).catch((err) => {
	    console.error('Error retrieving password:', err);
	});
    
    keytar.getPassword('bUntis', 'classes')
	.then((password) => {
	    if (password) {
		password = password.split(" ");
		myClasses = password;
		//console.log(password);
		return password
	    } else {
		console.log('Password not found');
	    }
	}).catch((err) => {
	    console.error('Error retrieving password:', err);
	});

    return ["NOTHING :("];
}

export { settings };
