export function getTodaysFullDateSlash() {
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

export function getTodaysFullDateDots() {
  return getTodaysYear() + "." + getTodaysMonth() + "." + getTodaysDate();
}

export function getTodaysFullDateDashes() {
  return getTodaysYear() + "-" + getTodaysMonth() + "-" + getTodaysDate();
}

export function getTodaysDate() {
  var today = new Date();
  today = today.getDate();
  if (today < 10) {
    today = '0' + today
  }
  return today;
}

export function getTodaysMonth() {
  var today = new Date();
  today = today.getMonth() + 1;
  if (today < 10) {
    today = '0' + today
  }
  return today;
}

export function getTodaysYear() {
  var today = new Date();
  return today.getFullYear();
}
