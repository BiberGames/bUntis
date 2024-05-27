import { utils } from '../code/utils.js';
const { ipcRenderer } = require('electron');

const settings = {};

settings.saveSettings = async function(_school, _username, _server, _code, _classes) {
    var saveDataServer = [];
    var classes = [];

    saveClient(_classes, "");
    
    saveDataServer.push(_school);
    saveDataServer.push(_username);
    saveDataServer.push(_code);
    saveDataServer.push(_server);

    const result = await ipcRenderer.invoke('server:saveDataToFile', 'login', JSON.stringify(saveDataServer));
    await ipcRenderer.invoke('server:restart');
}

async function saveClient(saveData, hook) {
    const result = await ipcRenderer.invoke('server:saveDataToFile', 'classes', 'saveData');
    await ipcRenderer.invoke('server:saveDataToFile', 'setup', 1);
    
}

settings.loadSettings = async function() {
    let classes = await ipcRenderer.invoke('server:readDataToFile', 'classes');
    global.classes = classes.split(" ");
}

export { settings };
