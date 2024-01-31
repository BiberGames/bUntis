const md5 = require('../code/md5.js');

//const {sanitizeInput} = 
const save = async function(_school, _username, _server, _code, _classes) {
	var saveData = [];
	var classes = [];

	classes = _classes.split(" ,");
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

module.exports = {
    save
}