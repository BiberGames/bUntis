const md5 = require('../code/md5.js');
const utils = require('../code/utils.js');
const keytar = require('keytar');

//const {sanitizeInput} = 
const saveSettings = async function(_school, _username, _server, _code, _classes) {
    var saveDataServer = [];
    var saveDataClient = [];
    var classes = [];

    classes = _classes.split(" ");

    for (let i = 0; i < classes.length; i++) {
	saveDataClient.push(classes[i]);
    }

    saveDataClient = JSON.stringify(saveDataClient);
    //console.log(saveDataClient);

    saveClient(saveDataClient);
    
    saveDataServer.push(_school);
    saveDataServer.push(_username);
    saveDataServer.push(_code);
    saveDataServer.push(_server);

    const result = await ipcRenderer.invoke('server:save', saveDataServer);
}

function saveClient(saveData, hook) {
    keytar.setPassword('bUntis', 'classes', JSON.stringify(saveData))
	.then(() => {
            console.log('Password saved successfully');
	})
	.catch((err) => {
            console.error('Error saving password:', err);
	});
}

const loadSettings = function() {
    let data;
    keytar.getPassword('bUntis', 'classes')
	.then((password) => {
	    if (password) {
		password = JSON.parse(password);
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

module.exports = {
    saveSettings, loadSettings
}
