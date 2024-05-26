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

    const result = await ipcRenderer.invoke('server:save', saveDataServer);
}

async function saveClient(saveData, hook) {
    const result = await ipcRenderer.invoke('server:saveTimeTable', saveData);
}

settings.loadSettings = async function() {
    //const firstTime = await ipcRenderer.invoke('server:readSetup');

    let classes = await ipcRenderer.invoke('server:readClases');
    classes = classes.split(" ");
    return classes;
}

export { settings };
