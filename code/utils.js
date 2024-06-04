const utils = {};

utils.removeDuplicatesAndSort = function(data) {
    return data.filter((item, index) => data.indexOf(item) === index).sort();
}

utils.convertUntisDate = function(date) {
    var day = `${String(date).substr(6, 2)}`;
    var month = `${String(date).substr(4, 2)}`;
    var year = `${String(date).substr(0, 4)}`;
    return `${day}.${month}.${year}`;
}

utils.getDateDistance = function(dateOne, dateTwo) {
    var dateOneSub = dateOne.split(".");
    var dateTwoSub = dateTwo.split(".");
    var distance = 0;
    // If dateT wo is smaller than dateOne, switch them.
    distance += (dateOneSub[2] - dateTwoSub[2]) * 365 + (dateOneSub[1] - dateTwoSub[1]) * 31 + (dateOneSub[0] - dateTwoSub[0]);
    return distance;
}

utils.mergeCells = function(table, x, y) {
    if(utils.getCellInTable(table, x, y).innerHTML == utils.getCellInTable(table, x, y-1).innerHTML) {
	utils.getCellInTable(table, x, y).style.display = 'none';
	utils.getCellInTable(table, x, y-1).rowSpan = '2';
    }
}

utils.setContentInTable = function(table, x, y, input) {
    if(table.rows[y].cells[x].innerHTML !== '')
        return;
    
    table.rows[y].cells[x].innerHTML = input;
}

utils.isMyClass = function(myClasses, className) {
    for(let i = 0; i < myClasses.length; i++) {
        if(className == myClasses[i]) {
            return true;
        }
    }
    return false;
}

utils.getCellInTable = function(table, x, y) {
    if(x < 0) {
	return table.rows[y].cells[0];
    }
    
    if(y < 0) {
	return table.rows[0].cells[x];
    }
    
    return table.rows[y].cells[x];
}

utils.sanitizeInput = function(input) {
    return input;//.replace(/^[a-zA-Z0-9_.]+$/g, '');
}

utils.endTimeToElements = function(time) {
    const timeMap = {
	745: 0,
	920: 1,
	1025: 2,
	1115: 3,
	1220: 4,
	1310: 5,
	1425: 6,
	1515: 7
    };

    return timeMap[time];
}

utils.startTimeToElements = function(time) {
    const timeMap = {
        745: 0,
        835: 1,
        940: 2,
        1030: 3,
        1135: 4,
        1225: 5,
        1340: 6,
        1430: 7
    };

    return timeMap[time];
}

utils.getFirstDayOfWeek = function() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
    
    // If today is Sunday or Saturday, advance to the next week
    if (currentDay === 0 || currentDay === 6) {
	const daysUntilMonday = currentDay === 0 ? 1 : 2;
	today.setDate(today.getDate() + daysUntilMonday);
    }
    
    // Calculate the Monday of the current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    
    return monday;
}

utils.toUntisDate = function(date) {
    let month = date.getMonth() +1;
    let day = date.getDate();

    if(month < 10)
	month = "0" + month;

    if(day < 10)
	day = "0" + day;
    
    let newDate = date.getFullYear() + "" + month + "" + day;

    return newDate;
}

utils.getWeekDates = function() {
    let dates = [];
    let startDate = utils.getFirstDayOfWeek();
    startDate = parseInt(utils.toUntisDate(startDate));
    //console.log(startDate);

    dates.push(startDate);
    for(let i = 1; i < 5; i++)
	dates.push(startDate + i); // add some kind of overflow check

    return dates;
}

export { utils };
