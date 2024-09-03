import { utils } from "./utils.js";

const homework = {};

homework.show = function(homeWorkTable, homeWorkData) {
    //console.log(homeWorkData);
    if(homeWorkData.homeworks.length === 0) {
	var row = homeWorkTable.insertRow();
        var cellSubject = row.insertCell();
        var cellTimeSpan = row.insertCell();
        var cellHomeworkText = row.insertCell();
	cellSubject.innerHTML = 'Have a nice day!';
    }

    var today = new Date();

    for(let i = 0; i < homeWorkData.homeworks.length; i++) {
	if(homeWorkData.homeworks[i].completed !== true) {
	    var homeWorkDueDate = utils.convertUntisDate(homeWorkData.homeworks[i].dueDate);

            var row = homeWorkTable.insertRow();
            var cellSubject = row.insertCell();
            var cellTimeSpan = row.insertCell();
            var cellHomeworkText = row.insertCell();
	    
            cellSubject.innerHTML = getSubjectFromHomeWork(homeWorkData.homeworks[i].lessonId, homeWorkData.lessons);
            cellTimeSpan.innerHTML = utils.convertUntisDate(homeWorkData.homeworks[i].date) + ' to ' + homeWorkDueDate;
            cellHomeworkText.innerHTML = homeWorkData.homeworks[i].text;
        }		
    }
}
function getSubjectFromHomeWork(id, subjects) {
    for(let i = 0; i < subjects.length; i++) {
        if(subjects[i].id == id) {
            return subjects[i].subject;
        }
    }
    return 'err';
}

export { homework };
