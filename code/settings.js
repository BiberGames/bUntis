//const {sanitizeInput} = 
const save = async function(_school, _username, _server, _code, _classes) {
	var saveData = [];
	var classes = [];

	classes = _classes.split(",");

	saveData.push(_school);
	saveData.push(_username);
	saveData.push(_code);
	saveData.push(_server);
	saveData.push(classes);

	console.log(saveData);

}

module.exports = {
    save
}