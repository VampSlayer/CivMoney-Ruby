function getTodaysFullDateSlash() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }

    if (mm < 10) {
        mm = '0' + mm
    }

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

function getTodaysFullDateDots(){
  return getTodaysYear() + "." + getTodaysMonth() + "." + getTodaysDate();
}

function getTodaysDate(){
  var today = new Date();
  return today.getDate();
}

function getTodaysMonth(){
  var today = new Date();
  return today.getMonth() + 1;
}

function getTodaysYear(){
  var today = new Date();
  return today.getFullYear();
}
