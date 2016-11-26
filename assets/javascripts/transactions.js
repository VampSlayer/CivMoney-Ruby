function addTransaction() {
    var dateString = $("#Datum").val();
    var amount = $("#Amount").val();
    var description = $("#Description").val();

    var year = dateString.substring(0, 4);
    var month = dateString.substring(5, 7);
    var day = dateString.substring(8, 10);
    var uri = '/transaction?';
    clearIt("#Added");

    if(amount == "" | description == ""){
        bindIt("#Added", "Enter Amount and Description!");
    }
    else if(document.getElementById('Expense').checked && document.getElementById('Income').checked){
        bindIt("#Added", "Check either Income or Expense!");
    } else if (document.getElementById('Income').checked && amount != "" && description != "") {
        $.ajax({
            type: "POST",
            url: uri,
            data: 'transaction[amount]=' + amount + '&transaction[description]=' + description + '&transaction[date]=' + year + '.' + month + '.' + day,
            success: function() {
            }
        });
        location.reload();
    } else if (document.getElementById('Expense').checked && amount != "" && description != "") {
        $.ajax({
            type: "POST",
            url: uri,
            data: 'transaction[amount]=' + -amount + '&transaction[description]=' + description + '&transaction[date]=' + year + '.' + month + '.' + day,
            success: function() {
            }
        });
        location.reload();
    } else {
        bindIt("#Added", "Income Or Expense?");
    }
}

function getTotal(yyyy, mm, dd, uri, tag){
  $.ajax({
      url: uri,
      type: "get",
      dataType: "json",
      data: {},
      async: true,
      success: function (data) {
         bindColorForValue(tag, ( Math.round(data[0].total* 100) / 100 ));
      }
  });
}

function getTable(yyyy, mm, dd, uri, tableTag, rowNeeded){
        $.ajax({
            url:  uri,
            type: "get",
            dataType: "json",
            async: true,
            data: {},
            success: function (data) {
                drawTable(data, tableTag, rowNeeded);
            }
        });
}

function getAndDrawRangeTable() {

    var dateString0 = $("#FirstDatum").val();
    var year0 = dateString0.substring(0, 4);
    var month0 = dateString0.substring(5, 7);
    var day0 = dateString0.substring(8, 10);

    var dateString1 = $("#LastDatum").val();

    var year1 = dateString1.substring(0, 4);
    var month1 = dateString1.substring(5, 7);
    var day1 = dateString1.substring(8, 10);

        $.ajax({
            url: '/transactions/range?[year0]=' + year0 + '&[month0]=' + month0 + '&[day0]=' + day0 + '&[year1]=' + year1 + '&[month1]=' + month1 + '&[day1]=' + day1,
            type: "get",
            dataType: "json",
            data: {},
            success: function (data) {
                clearTable("#SummaryTable");
                drawTableWithCheckBoxes(data, "#SummaryTable");
                data2 = data;
            }
        });
    }

    function getCheckBoxDataForDelete() {

        var dateString0 = $("#FirstDatum").val();
        var year0 = dateString0.substring(0, 4);
        var month0 = dateString0.substring(5, 7);
        var day0 = dateString0.substring(8, 10);

        var dateString1 = $("#LastDatum").val();

        var year1 = dateString1.substring(0, 4);
        var month1 = dateString1.substring(5, 7);
        var day1 = dateString1.substring(8, 10);

            $.ajax({
                url: '/transactions/range?[year0]=' + year0 + '&[month0]=' + month0 + '&[day0]=' + day0 + '&[year1]=' + year1 + '&[month1]=' + month1 + '&[day1]=' + day1,
                type: "get",
                dataType: "json",
                data: {},
                success: function (data) {
                    data2 = data;
                    return data2;
                }
            });
        }

function deleteTransaction(data2) {
    var data = data2;
    var length = data.length;
    for (var i = 0; i < length; i++) {
        if (document.getElementById("chk_" + i).checked) {
            $.ajax({
                url: '/transactions/delete?[id]=' + data[i].id,
                type: 'DELETE',
                dataType: "json",
                async: false,
                success: function (data) {
                }
            });
        }
    }
    getAndDrawRangeTable();
}

function getThisYearsMontlyTotals(){

                $.ajax({
                    url: '/transactions/yearsMonthTotals',
                    type: "get",
                    dataType: "json",
                    data: {},
                    success: function (data) {
                        drawTable(data, "#SummaryTable", "Month");
                    }
                });
}

function getThisMonthsWeeksTotals(){
                $.ajax({
                    url: '/transactions/monthsWeekTotals',
                    type: "get",
                    dataType: "json",
                    data: {},
                    success: function (data) {
                        drawTable(data, "#SummaryTable", "Week");
                    }
                });
}

function addThisMonthsIncomesAndExpenses() {
    var mm = getTodaysMonth();
    var incomeX = $("#Income").val();
    var expenseX = $("#Expense").val();
            $.ajax({
                type: "POST",
                async: true,
                url: '/transactions/addMonthsIncomesExpenses?',
                data: '[income]='+incomeX+'&[expense]='+expenseX+'&[month]='+mm,
                success: function () {
                          bindIt("#Added", "Income & Expenses Added");
                }
            });
}
