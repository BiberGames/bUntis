const show = function(homeWorkTable, homeWorkData) {
    //console.log(homeWorkData);
    for(let i = 0; i < homeWorkData.homeworks.length; i++) {
        var row = homeWorkTable.insertRow();
        var cellSubject = row.insertCell();
        var cellTimeSpan = row.insertCell();
        var cellHomeworkText = row.insertCell();
        var cellDone = row.insertCell();

        // if homework is marked compleated
        if(homeWorkData.homeworks[i].completed == true) {
            cellDone.innerHTML = 'Completed';
        }
        else {
            cellDone.innerHTML = 'Pending';
        }

        cellSubject.innerHTML = getSubjectFromHomeWork(homeWorkData.homeworks[i].lessonId, homeWorkData.lessons);
        cellTimeSpan.innerHTML = utils.convertUntisDate(homeWorkData.homeworks[i].date) + ' to ' +utils.convertUntisDate(homeWorkData.homeworks[i].dueDate);
        cellHomeworkText.innerHTML = homeWorkData.homeworks[i].text;
        //cellDone.innerHTML = '<input type="checkbox" onclick="return false"/>';
    }
}

module.exports = {
    show
}
