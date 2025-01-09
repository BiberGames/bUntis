const { ipcRenderer, shell } = require('electron');

const platformClient = {};

platformClient.openURL = async function(url) {
    return await shell.openExternal(url);
}

platformClient.invoke = async function(...channel) {
    return ipcRenderer.invoke(...channel);
}

platformClient.on = function(port, func) {
} 

export { platformClient };
