import { utils } from "./utils.js";

const homework = {};

homework.show = async function(_homeWorkData) {
    const homeworkList = _homeWorkData.homeworks;
    const homeworkDates = [];
    
    if(homeworkList.length === 0) {
        const row = homeWorkTable.insertRow();
	utils.addCellToRow(row, '🏖️ Have a nice day!', '');
        return;
    }

    homeworkList.forEach(homework => {
	if(homework.completed !== true)
	    homeworkDates.push(homework.dueDate);
    });

    const uniqueSortedDates = utils.removeDuplicatesAndSort(homeworkDates);

    uniqueSortedDates.forEach(date => {
	var headerRow = homeWorkTable.insertRow();
	var headerCellContent = `<h3>${utils.convertUntisDate(date)}</h3>`
	utils.addCellToRow(headerRow, headerCellContent, 'homeworkTableDate');

	homeworkList.forEach(homework => {
	    if(homework.dueDate === date) {
		const subject = getSubjectFromHomeWork(homework.lessonId, _homeWorkData.lessons);
		const cellContent = `
                    <img src="../images/font/menu_book_white_24dp.svg">
                    ${subject || 'Unknown Subject'}
                    <br>
                    <img src="../images/font/home_work_white_24dp.svg">
                    ${homework.text || 'No Description given.'}
                `;
		
		const row = homeWorkTable.insertRow();
		utils.addCellToRow(row, cellContent, 'homeworkTableData');
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
