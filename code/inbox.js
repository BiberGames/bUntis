import { utils } from "./utils.js";

const inbox = {};
var msgs = [];

inbox.show = async function(_inboxData) {
    for(let i = 0; i < _inboxData.incomingMessages.length; i++) {
	msgs.push(_inboxData.incomingMessages[i].subject);	
    }

    for(let i = 0; i < _inboxData.incomingMessages.length; i++) {
	var row = inboxTable.insertRow();
	var cellHeader = row.insertCell();

	cellHeader.innerHTML += '<h3>' + _inboxData.incomingMessages[i].sender.displayName + ' • ' + _inboxData.incomingMessages[i].subject + '</h3>';
	cellHeader.classList.add('inboxTableHeader');
	
	var row = inboxTable.insertRow();
	var cellContent = row.insertCell();
	if(_inboxData.incomingMessages[i].contentPreview) {
	    cellContent.innerHTML = _inboxData.incomingMessages[i].contentPreview;
	}
	else {
	    cellContent.innerHTML = 'This message doesn’t seem to contain any information.';
	}
	cellContent.classList.add('inboxTableContent');
    }
}

export { inbox };
