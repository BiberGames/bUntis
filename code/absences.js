import { utils } from "./utils.js";

const absences = {};

absences.show = async function (_absencesData) {
    const absencesList = _absencesData.absences;
    const absencesDates = [];

    if (absencesList.length === 0) {
        const row = absencesTable.insertRow();
        const cell = row.insertCell();
        cell.innerHTML = '🏖️ Have a nice day!';
        return;
    }

    absencesList.forEach(absence => {
        absencesDates.push(absence.startDate);
    });

    const uniqueSortedDates = utils.removeDuplicatesAndSort(absencesDates);

    uniqueSortedDates.forEach(date => {
        const headerRow = absencesTable.insertRow();
        const headerCell = headerRow.insertCell();
        headerCell.innerHTML = `<h3>${utils.convertUntisDate(date)}</h3>`;
        headerCell.classList.add('absencesTableDate');

        absencesList.forEach(absence => {
            if (absence.startDate === date) {
                const row = absencesTable.insertRow();
                const cell = row.insertCell();

                cell.classList.add(absence.isExcused ? 'absencesTableDataDone' : 'absencesTableData');

                cell.innerHTML = `
                    <img src="../images/font/person_white_24dp.svg">
                    ${absence.createdUser || 'Unknown User'}
                    <br>
                    <img src="../images/font/home_work_white_24dp.svg">
                    ${absence.reason || 'No reason given.'}
                    From ${absence.startTime} - ${absence.endTime}
                `;
            }
        });
    });
};

export { absences };
