import { utils } from "./utils.js";

const inbox = {};
var msgs = [];

inbox.show = async function(_inboxData) {
    for(let i = 0; i < _inboxData.incomingMessages.length; i++) {
	msgs.push(_inboxData.incomingMessages[i].subject);	
    }

    for(let i = 0; i < _inboxData.incomingMessages.length; i++) {
	const cellContent = `<h3> ${_inboxData.incomingMessages[i].sender.displayName} • ${_inboxData.incomingMessages[i].subject} </h3>`;
	
	var row = inboxTable.insertRow();
	var cellHeader = utils.addCellToRow(row, cellContent, 'inboxTableHeader');
	
	var row = inboxTable.insertRow();
	if(_inboxData.incomingMessages[i].contentPreview) {
	    utils.addCellToRow(row, _inboxData.incomingMessages[i].contentPreview, 'inboxTableContent');
	}
	else {
	    utils.addCellToRow(row, 'This message doesn’t seem to contain any information.', 'inboxTableContent');
	}
    }
}

export { inbox };
