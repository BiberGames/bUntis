import { utils } from "./utils.js";

const homework = {};

homework.show = async function(_homeWorkData) {
    const homeworkList = _homeWorkData.homeworks;
    const homeworkDates = [];
    
    if(homeworkList.length === 0) {
	var row = homeWorkTable.insertRow();
        var cellSubject = row.insertCell();
	cellSubject.innerHTML = '🏖️ Have a nice day!';
	return;
    }

    homeworkList.forEach(homework => {
	if(homework.completed !== true)
	    homeworkDates.push(homework.dueDate);
    });

    const uniqueSortedDates = utils.removeDuplicatesAndSort(homeworkDates);

    uniqueSortedDates.forEach(date => {
	var headerRow = homeWorkTable.insertRow();
	var headerCell = headerRow.insertCell();
	headerCell.innerHTML = '<h3>' + utils.convertUntisDate(date) + '</h3>';
	headerCell.classList.add('homeworkTableDate');

	homeworkList.forEach(homework => {
	    if(homework.dueDate === date) {
		var row = homeWorkTable.insertRow();
		var cell = row.insertCell();
		cell.classList.add('homeworkTableData');
		
		const subject = getSubjectFromHomeWork(homework.lessonId, _homeWorkData.lessons);
		cell.innerHTML = `
                    <img src="../images/font/menu_book_white_24dp.svg">
                    ${subject || 'Unknown Subject'}
                    <br>
                    <img src="../images/font/home_work_white_24dp.svg">
                    ${homework.text || 'No Description given.'}
                `;
	    }
	});
    });
};

function getSubjectFromHomeWork(id, subjects) {
    for(let i = 0; i < subjects.length; i++) {
        if(subjects[i].id === id) {
            return subjects[i].subject;
        }
    }
    return 'err';
}

export { homework };
