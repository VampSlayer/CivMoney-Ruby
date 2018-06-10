 export function toLocaleDate(date){
	return new Date(date).toLocaleString().split(',')[0];
}

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


export function getNumberOfDaysThisMonth(){
   var today = new Date();
   var lastDay = new Date(today.getYear(), today.getMonth() +1, 0);	
   return lastDay.getDate();
}

export function getNumberOfDaysForMonth(month){
   var today = new Date();
   var lastDay = new Date(today.getYear(), getMonthNumber(month), 0);	
   return lastDay.getDate();
}

export function getTodaysMonthName(){
  var today = new Date();
  today = today.getMonth() + 1;
 var months = {1:"January", 2:"Febuary", 3:"March", 4:"April", 5:"May", 6:"June", 7:"July", 8:"August", 9:"September", 10:"October", 11:"November", 12:"December"};
return months[today];
}

export function getMonths(){
  return ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
}

export function getMonthNumber(month){
 var months = {"January":1, "Febuary":2, "March":3, "April":4, "May":5, "June":6, "July":7, "August":8, "September":9, "October":10, "November":11, "December":12};
return months[month];
}

