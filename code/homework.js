import { utils } from "./utils.js";

const homework = {};
var homeworkDates = [];

homework.show = function(homeWorkTable, homeWorkData) {
    console.log(homeWorkTable)
    console.log(homeWorkData);

    if(homeWorkData.homeworks.length === 0) {
	var row = homeWorkTable.insertRow();
        var cellSubject = row.insertCell();
	cellSubject.innerHTML = '🏖️ Have a nice day!';
    }

    var today = new Date();

    for(let i = 0; i < homeWorkData.homeworks.length; i++) {
	if(homeWorkData.homeworks[i].completed !== true) {
	    homeworkDates.push(homeWorkData.homeworks[i].dueDate);
        }		
    }
    
    homeworkDates = utils.removeDuplicatesAndSort(homeworkDates);
    
    for(let i = 0; i < homeworkDates.length; i++) {
	var row = homeWorkTable.insertRow();
	var cellDate = row.insertCell();
	cellDate.innerHTML = '<h3>' + utils.convertUntisDate(homeworkDates[i]) + '</h3>';
	cellDate.classList.add('homeworkTableDate');

	for(let hw = 0; hw < homeWorkData.homeworks.length; hw++) {
	    if(homeWorkData.homeworks[hw].dueDate === homeworkDates[i]) {
		var row = homeWorkTable.insertRow();
		var cellInfo = row.insertCell();
		cellInfo.classList.add('homeworkTableData');
		
		cellInfo.innerHTML += '<img src="../images/font/menu_book_white_24dp.svg">';
		cellInfo.innerHTML += getSubjectFromHomeWork(homeWorkData.homeworks[hw].lessonId, homeWorkData.lessons);

		/*row = homeWorkTable.insertRow();
		var cellHwText = row.insertCell();*/
		cellInfo.innerHTML += '<br>';
		cellInfo.innerHTML += '<img src="../images/font/home_work_white_24dp.svg">';
		cellInfo.innerHTML += homeWorkData.homeworks[hw].text;
	    }
	}
    }
    console.log(homeworkDates);
}

function getSubjectFromHomeWork(id, subjects) {
    for(let i = 0; i < subjects.length; i++) {
        if(subjects[i].id === id) {
            return subjects[i].subject;
        }
    }
    return 'err';
}

export { homework };
