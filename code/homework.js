const show = function(homeWorkTable, homeWorkData) {
    //console.log(homeWork);
    for(let i = 0; i < homeWorkData.homeworks.length; i++) {
        var row = homeWorkTable.insertRow();
        var cellSubject = row.insertCell();
        var cellFrom = row.insertCell();
        var cellTo = row.insertCell();
        var cellHomeworkText = row.insertCell();

        // if homework is marked compleated
        if(homeWorkData.homeworks[i].completed == true) {
            cellSubject.style.backgroundColor += 'green';
            cellFrom.style.backgroundColor += 'green';
            cellTo.style.backgroundColor += 'green';
            cellHomeworkText.style.backgroundColor += 'green';
        }

        cellSubject.innerHTML = getSubjectFromHomeWork(homeWorkData.homeworks[i].lessonId, homeWorkData.lessons);
        cellFrom.innerHTML = utils.convertUntisDate(homeWorkData.homeworks[i].date);
        cellTo.innerHTML = utils.convertUntisDate(homeWorkData.homeworks[i].dueDate);
        cellHomeworkText.innerHTML = homeWorkData.homeworks[i].text;
    }
}

module.exports = {
    show
}
