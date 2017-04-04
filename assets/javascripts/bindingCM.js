function bindIt(tag, value) {
    $(tag).append(value);
}

function clearIt(tag){
  $(tag).empty();
}

function boldIt(tag){
  $(tag).toggleClass("bold")
}

function drawRow(rowData, table, rowNeeded, i) {
    var row = $("<tr />");
    if (rowNeeded === "date+amount") {
        $(table).append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
        if(rowData.date == getTodaysFullDateDashes()){
		row.append($("<td id=\"bold\">" + rowData.date + "</td>") );
        	row.append(colorItTag( $("<td id=\"boldDate\">" + ( Math.round(rowData.amount* 100) / 100 ) + "</td>") , rowData.amount ));
                boldIt("#bold");
		boldIt("#boldDate");
	}
	else if(rowData.date != getTodaysFullDateDashes()){
		row.append($("<td>" + rowData.date + "</td>") );
		row.append(colorItTag( $("<td>" + ( Math.round(rowData.amount* 100) / 100 ) + "</td>") , rowData.amount ));
	}
    }
    else if (rowNeeded === "amount") {
        $(table).append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
        row.append(colorItTag( $("<td>" + ( Math.round(rowData.amount* 100) / 100 ) + "</td>") , rowData.amount ));
    }
    else if (rowNeeded === "Date") {
        $(table).append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
        row.append($("<td>" + rowData.Date + "</td>"));
    }
    else if (rowNeeded === "Month") {
      var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var row = $("<tr />");
          $(table).append(row);
          row.append($("<td>" + months[rowData.datemonth-1] + "</td>"));
          row.append(colorItTag($("<td>" + ( Math.round(rowData.amount* 100) / 100 ) + "</td>"), rowData.amount));
    }
    else if (rowNeeded === "Week"){
          var row = $("<tr />");
          $(table).append(row);
          row.append($("<td>" + rowData.datemonth + "</td>"));
          row.append(colorItTag($("<td>" + ( Math.round(rowData.amount* 100) / 100 ) + "</td>"), rowData.amount));
    }
    else {
        $(table).append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
        row.append($("<td>" + rowData.Date.substring(0, 10) + "</td>"));
        row.append($("<td>" + ( Math.round(rowData.amount* 100) / 100 ) + "</td>"));
        row.append($("<td>" + rowData.Description + "</td>"));
    }
}

function drawTable(data, table, rowNeeded) {
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i], table, rowNeeded, i);
    }
}

function clearTable(tableTag) {
    $(tableTag +" tbody tr").remove();
}

function colorItTag(tag, data) {
    var coloredTag;
    if (data === 0) {
        coloredTag = tag.css("color", '#ff8c00');
    } else if (data > 0) {
        coloredTag = tag.css("color", '#008000');
    }
    else if (data < 0) {
        coloredTag = tag.css("color", '#ff0000');
    } else {
        coloredTag = tag.css("color", '#000000');
    }
    return coloredTag;
}

function bindColorForValue(tag, data) {
    $(tag).append(data);
    var end = tag.length;
    if (data === 0) {
        document.getElementById(tag.substring(1,end)).style.color =  '#ff8c00';
    } else if (data > 0) {
        document.getElementById(tag.substring(1, end)).style.color = '#008000';
    }
    else if (data < 0) {
        document.getElementById(tag.substring(1, end)).style.color = '#ff0000';
    } else {
        document.getElementById(tag.substring(1, end)).style.color = '#000000';
    }
}

function drawTableWithCheckBoxes(data, table) {
    for (var i = 0; i < data.length; i++) {
        drawRowWithCheckBoxes(data[i], table, i);
    }
}

function drawRowWithCheckBoxes(rowData, table, checkBoxvalue) {
        var row = $("<tr />");
        var chk = "<td><input type='checkbox' id='chk_" + checkBoxvalue + "'></td>";
        $(table).append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
        row.append($(chk));
        row.append($("<td>" + rowData.date.substring(0, 10) + "</td>"));
        row.append(colorItTag($ ("<td>" + ( Math.round(rowData.amount* 100) / 100 ) + "</td>"), rowData.amount));
        row.append($("<td>" + rowData.description + "</td>"));
}
