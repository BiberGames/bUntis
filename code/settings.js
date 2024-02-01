const md5 = require('../code/md5.js');

//const {sanitizeInput} = 
const saveSettings = async function(_school, _username, _server, _code, _classes) {
	var saveData = [];
	var classes = [];

	classes = _classes.split(", ");
	var hash = md5.calc(JSON.stringify(saveData));

	saveData.push(_school);
	saveData.push(_username);
	saveData.push(_code);
	saveData.push(_server);
	saveData.push(classes);
	saveData.push(hash);

	const result = await ipcRenderer.invoke('server:save', saveData);

	console.log(result);
}

const loadSettings = function(_settingsData) {
	var pharsedSettingsData = JSON.parse(_settingsData);

	document.getElementById('school').value = pharsedSettingsData[0];
	document.getElementById('name').value = pharsedSettingsData[1];
	document.getElementById('server').value = pharsedSettingsData[2];
	document.getElementById('code').value = pharsedSettingsData[3];
	document.getElementById("MyClassesInput").value = pharsedSettingsData[4];
}

module.exports = {
    saveSettings, loadSettings
}