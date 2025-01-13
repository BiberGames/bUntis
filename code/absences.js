import { utils } from "./utils.js";

const absences = {};

absences.show = async function (_absencesData) {
    // console.log(_absencesData);

    const headerRow = absencesTable.insertRow();
    utils.addCellToRow(headerRow, 'Teacher', 'absencesTableDate');
    utils.addCellToRow(headerRow, 'From', 'absencesTableDate');
    utils.addCellToRow(headerRow, 'To', 'absencesTableDate');
    utils.addCellToRow(headerRow, 'Reason', 'absencesTableDate');
    utils.addCellToRow(headerRow, 'Extra', 'absencesTableDate');
    
    const absencesList = _absencesData.absences;
    const absencesDates = [];
/*
    if (absencesList.length === 0) {
        const row = absencesTable.insertRow();
	utils.addCellToRow(row, '🏖️ Have a nice day!', '');
        return;
    }
*/
    absencesList.forEach(absence => {
        absencesDates.push(absence.startDate);
    });

    const uniqueSortedDates = utils.removeDuplicatesAndSort(absencesDates).reverse();
    uniqueSortedDates.forEach(date => {
        absencesList.forEach(absence => {
            if (absence.startDate === date) {
		const cellTeacher = `${absence.createdUser || 'Unknown User'}`;
		const CellFrom = `${utils.convertUntisDate(absence.startDate)} ${utils.convertUnitsTime(absence.startTime)}`;
		const CellTo = `${utils.convertUntisDate(absence.endDate)} ${utils.convertUnitsTime(absence.endTime)}`;
		const CellReason = `${absence.reason || '---'}`;
		const CellExtra = `${absence.text || '---'}`;

                const row = absencesTable.insertRow();
		const CellIsExcused = absence.isExcused ? 'absencesTableDataDone' : 'absencesTableData';
                utils.addCellToRow(row, cellTeacher, CellIsExcused);
		utils.addCellToRow(row, CellFrom, CellIsExcused);
		utils.addCellToRow(row, CellTo, CellIsExcused);
		utils.addCellToRow(row, CellReason, CellIsExcused);
		utils.addCellToRow(row, CellExtra, CellIsExcused);
            }
        });
    });
};

export { absences };
