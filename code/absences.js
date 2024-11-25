import { utils } from "./utils.js";

const absences = {};
var absencesDates = [];

absences.show = async function(_absencesData) {
    console.log(_absencesData.absences);

    if(_absencesData.absences.length === 0) {
	var row = absencesTable.insertRow();
        var cellSubject = row.insertCell();
	cellSubject.innerHTML = '🏖️ Have a nice day!';
	return;
    }
    
    for(let i = 0; i < _absencesData.absences.length; i++) {
	if(!_absencesData.absences[i].isExcused) {
	    absencesDates.push(_absencesData.absences[i].startDate);
        }		
    }
    
    absencesDates = utils.removeDuplicatesAndSort(absencesDates);
     
    for(let i = 0; i < absencesDates.length; i++) {
	if(_absencesData.absences[i].isExcused) i++
	
	var row = absencesTable.insertRow();
	var cellHeader = row.insertCell();
	cellHeader.innerHTML += '<h3>' + utils.convertUntisDate(absencesDates[i]) + '</h3>';
	cellHeader.classList.add('absencesTableDate');
	
	for(let as = 0; as < _absencesData.absences.length; as++) {
	    if(_absencesData.absences[as].startDate === absencesDates[i]) {
		var row = absencesTable.insertRow();
		var cellInfo = row.insertCell();
		cellInfo.classList.add('absencesTableData');
		
		cellInfo.innerHTML += '<img src="../images/font/person_white_24dp.svg">';
		cellInfo.innerHTML += _absencesData.absences[as].createdUser;
		
		if(_absencesData.absences[as].reason === '')
		    _absencesData.absences[as].reason = 'No reason given.'
		
		cellInfo.innerHTML += '<br>';
		cellInfo.innerHTML += '<img src="../images/font/home_work_white_24dp.svg">';
		cellInfo.innerHTML += _absencesData.absences[as].reason;
		cellInfo.innerHTML += ' From ' + _absencesData.absences[as].startTime + ' - ' + _absencesData.absences[as].endTime;
	    }
	}
	
    }
}

export { absences };
