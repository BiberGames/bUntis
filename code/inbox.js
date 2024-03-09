const show = async function(_inboxData) {
    console.log(_inboxData);
    
    for(let i = 0; i < _inboxData.incomingMessages.length; i++) {
        var row = inboxTable.insertRow();
	var cellSender = row.insertCell();
        var cellSubject = row.insertCell();
	var cellContent = row.insertCell();
        //var cellTimeSpan = row.insertCell();
        //var cellHomeworkText = row.insertCell();

	cellSender.innerHTML = _inboxData.incomingMessages[i].sender.displayName;
        cellSubject.innerHTML = _inboxData.incomingMessages[i].subject;
	try {
	    cellContent.innetHTML = _inboxData.incomingMassages[i].contentPreview;
	}
	catch(e)
	{
	    
	}
	//getSubjectFromHomeWork(homeWorkData.homeworks[i].lessonId, homeWorkData.lessons);
        //cellTimeSpan.innerHTML = utils.convertUntisDate(homeWorkData.homeworks[i].date) + ' to ' +utils.convertUntisDate(homeWorkData.homeworks[i].dueDate);
        //cellHomeworkText.innerHTML = homeWorkData.homeworks[i].text;		
    }
}

module.exports = {
    show
}
