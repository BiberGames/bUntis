import { utils } from './utils.js';
import { platformClient } from './platformClient.js';
// const { ipcRenderer } = require('electron');

const settings = {};

settings.saveSettings = async function(_school, _username, _server, _code, _classes) {
    var saveDataServer = [];
    var classes = [];

    saveClient(_classes, "");
    
    saveDataServer.push(_school);
    saveDataServer.push(_username);
    saveDataServer.push(_code);
    saveDataServer.push(_server);

    const result = await platformClient.invoke('server:saveDataToFile', 'login', JSON.stringify(saveDataServer));
    await platformClient.invoke('server:restart');
}

async function saveClient(saveData, hook) {
    const result = await platformClient.invoke('server:saveDataToFile', 'classes', saveData);
    await platformClient.invoke('server:saveUserData', 'setup', 1);
    
}

settings.loadSettings = async function() {
    let classes = await platformClient.invoke('server:readUserData', 'classes');
    global.classes = classes.split(" ");
}

export { settings };
