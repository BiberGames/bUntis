const removeDuplicatesAndSort = function(data) {
    return data.filter((item, index) => data.indexOf(item) === index).sort();
}

const convertUntisDate = function(date) {
    var day = `${String(date).substr(6, 2)}`;
    var month = `${String(date).substr(4, 2)}`;
    var year = `${String(date).substr(0, 4)}`;
    return `${day}.${month}.${year}`;
}

const mergeCells = function(table, x, y) {
	if(getCellInTable(table, x, y).innerHTML == getCellInTable(table, x, y-1).innerHTML) {
		getCellInTable(table, x, y).style.display = 'none';
		getCellInTable(table, x, y-1).rowSpan = '2';
	}
}

const setContentInTable = function(table, x, y, input) {
    table.rows[y].cells[x].innerHTML = input;
}

const isMyClass = function(myClasses, className) {
    for(let i = 0; i < myClasses.length; i++) {
        if(className == myClasses[i]) {
            return true;
        }
    }
    return false;
}

const getCellInTable = function(table, x, y) {
	if(x < 0) {
		return table.rows[y].cells[0];
	}

	if(y < 0) {
		return table.rows[0].cells[x];
	}

    return table.rows[y].cells[x];
}

const sanitizeInput = function(input) {
    return input.replace(/[^a-zA-Z0-9]/g, '');
}

module.exports = {
    removeDuplicatesAndSort, convertUntisDate, mergeCells, setContentInTable, isMyClass, getCellInTable, sanitizeInput
}