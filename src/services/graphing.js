import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated.js";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js"

export default {
  vodalPie(id, data, title, vm) {
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_dark);
    let chart = am4core.create(id, am4charts.PieChart);
    chart.data = data;
    let chartTitle = chart.titles.create();
    chartTitle.text = title;
    chartTitle.fontSize = 20;
    chartTitle.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    chartTitle.tooltipText = "Back"
    chartTitle.events.on("hit", () => {
      vm.drawVodalBar();
    }, vm)
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "amount";
    pieSeries.dataFields.category = "description";
    pieSeries.slices.template.fillOpacity = 0.2;
    pieSeries.slices.template.strokeWidth = 1;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.labels.template.text = "";
    pieSeries.slices.template
      .cursorOverStyle = [
        {
          "property": "cursor",
          "value": "pointer"
        }
      ];
    pieSeries.hiddenState.properties.opacity = 0.2;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
  },
  vodalBar(id, data, title, scope) {
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_dark);
    let chart = am4core.create(id, am4charts.XYChart);
    chart.data = data;
    var chartTitle = chart.titles.create();
    chartTitle.text = title;
    chartTitle.fontSize = 20;
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "type";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.labels.template.cursorOverStyle =
      am4core.MouseCursorStyle.pointer;
    categoryAxis.renderer.labels.template.events.on(
      "hit",
      event => {
        scope.createPieData(event.event.explicitOriginalTarget.data);
      },
      scope
    );
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = `${scope.me.currency}`;
    valueAxis.renderer.inside = true;
    function createSeries(field, scope) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.name = field;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "type";
      series.currency = scope.me.currency;
      series.sequencedInterpolation = true;
      series.fillOpacity = 0.5;
      series.stacked = true;
      if (field === "Total") {
        series.columns.template.adapter.add("stroke", function (fill, target) {
          if (target.dataItem && (target.dataItem.valueY < 0)) {
            return am4core.color("#ff3333");
          }
          else if (target.dataItem && (target.dataItem.valueY > 0)) {
            return am4core.color("#00FF7F");
          }
          else {
            return am4core.color("#ff8000");
          }
        });
        series.columns.template.adapter.add("fill", function (fill, target) {
          if (target.dataItem && (target.dataItem.valueY < 0)) {
            return am4core.color("#ff3333");
          }
          else if (target.dataItem && (target.dataItem.valueY > 0)) {
            return am4core.color("#00FF7F");
          }
          else {
            return am4core.color("#ff8000");
          }
        });
      }
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText =
        "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY} {currency}";
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      series.columns.template.events.on(
        "hit",
        event => {
          scope.createPieData(event.target.dataItem.dataContext.type);
        },
        scope);
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;
      return series;
    }
    chart.data.forEach(element => {
      let keys = Object.keys(element).filter(x => {
        return x != "type";
      });
      keys.forEach(x => {
        createSeries(x, scope);
      });
    });
  },
  graphMonth(id, data, scope) {
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(id, am4charts.XYChart);
    chart.data = data;
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.dateFormats.setKey("datemonth", "DD");
    dateAxis.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = `${scope.me.currency}`;
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "amount";
    series.dataFields.dateX = "date";
    series.currency = scope.me.currency;
    series.columns.template.adapter.add("stroke", function (fill, target) {
      if (target.dataItem && (target.dataItem.valueY < 0)) {
        return am4core.color("#ff3333");
      }
      else if (target.dataItem && (target.dataItem.valueY > 0)) {
        return am4core.color("#00FF7F");
      }
      else {
        return am4core.color("#ff8000");
      }
    });
    series.columns.template.adapter.add("fill", function (fill, target) {
      if (target.dataItem && (target.dataItem.valueY < 0)) {
        return am4core.color("#ff3333");
      }
      else if (target.dataItem && (target.dataItem.valueY > 0)) {
        return am4core.color("#00FF7F");
      }
      else {
        return am4core.color("#ff8000");
      }
    });
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series.columns.template.events.on(
      "hit",
      event => {
        scope.show = true;
        scope.selectedDate = event.target.dataItem.dataContext.date;
      },
      scope
    );
    series.columns.template.tooltipText = "[bold]{valueY} {currency}[/]";
    series.fillOpacity = 0.5;

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "amount";
    lineSeries.dataFields.dateX = "date";
    lineSeries.tensionX = 0.7;
    lineSeries.stroke = am4core.color("#fff");
    lineSeries.strokeWidth = 3;
    lineSeries.strokeOpacity = 0.75;

    let range = valueAxis.createSeriesRange(series);
    range.contents.strokeOpacity = 0;
    range.value = -Number.MAX_SAFE_INTEGER;
    range.endValue = Number.MAX_SAFE_INTEGER;

    function createTrendLine(data, trendAverageValue, currency) {
      var trend = chart.series.push(new am4charts.LineSeries());
      trend.dataFields.valueY = "value";
      trend.dataFields.dateX = "date";
      trend.currency = currency;
      trend.strokeWidth = 3;
      trend.strokeDasharray = 4;
      if (trendAverageValue < 0) {
        trend.stroke = trend.fill = am4core.color("#ff3333");
      }
      else if (trendAverageValue > 0) {
        trend.stroke = trend.fill = am4core.color("#00FF7F");
      }
      else {
        trend.stroke = trend.fill = am4core.color("#ff8000");
      }
      trend.data = data;

      var bullet = trend.bullets.push(new am4charts.CircleBullet());
      bullet.tooltipText = "{valueY} {currency}[/]";
      bullet.strokeWidth = 2;
      bullet.stroke = trend.stroke;
      bullet.circle.fill = trend.stroke;
    
      var hoverState = bullet.states.create("hover");
      hoverState.properties.scale = 1.7;

      return trend;
    }

    const sumOfData = data.map(x => { return x.amount }).reduce((a, b) => a + b, 0);
    createTrendLine([
      { "date": data[data.length - 1].date, "value": sumOfData },
      { "date": data[0].date, "value": sumOfData }
    ], sumOfData, scope.me.currency);
  },
  graphYear(id, data, scope) {
    am4core.useTheme(am4themes_dark);
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(id, am4charts.XYChart);
    chart.data = data;
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.dateFormats.setKey("datemonth", "MMMM");
    dateAxis.renderer.labels.template.cursorOverStyle =
      am4core.MouseCursorStyle.pointer;
    dateAxis.renderer.labels.template.events.on(
      "hit",
      event => {
        scope.selectedMonth = {
          Jan: "01",
          Feb: "02",
          Mar: "03",
          Apr: "04",
          May: "05",
          Jun: "06",
          Jul: "07",
          Aug: "08",
          Sep: "09",
          Oct: "10",
          Nov: "11",
          Dec: "12"
        }[event.event.explicitOriginalTarget.data.split(" ")[0]]
      },
      scope
    );
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = `${scope.me.currency}`;
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "amount";
    series.dataFields.dateX = "datemonth";
    series.currency = scope.me.currency;
    series.columns.template.adapter.add("stroke", function (fill, target) {
      if (target.dataItem && (target.dataItem.valueY < 0)) {
        return am4core.color("#ff3333");
      }
      else if (target.dataItem && (target.dataItem.valueY > 0)) {
        return am4core.color("#00FF7F");
      }
      else {
        return am4core.color("#ff8000");
      }
    });
    series.columns.template.adapter.add("fill", function (fill, target) {
      if (target.dataItem && (target.dataItem.valueY < 0)) {
        return am4core.color("#ff3333");
      }
      else if (target.dataItem && (target.dataItem.valueY > 0)) {
        return am4core.color("#00FF7F");
      }
      else {
        return am4core.color("#ff8000");
      }
    });
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series.columns.template.events.on(
      "hit",
      event => {
        scope.show = true;
        scope.monthBar = event.target.dataItem.dataContext.datemonth;
      },
      scope
    );
    series.columns.template.tooltipText = "[bold]{valueY} {currency}[/]";
    series.fillOpacity = 0.5;

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "amount";
    lineSeries.dataFields.dateX = "datemonth";
    lineSeries.tensionX = 0.7;
    lineSeries.stroke = am4core.color("#FFF");
    lineSeries.strokeWidth = 3;
    lineSeries.strokeOpacity = 0.75;

    let range = valueAxis.createSeriesRange(series);
    range.value = -Number.MAX_SAFE_INTEGER;
    range.endValue = Number.MAX_SAFE_INTEGER;

    function createTrendLine(data, trendAverageValue, year, currency) {
      var trend = chart.series.push(new am4charts.LineSeries());
      trend.dataFields.valueY = "value";
      trend.dataFields.dateX = "date";
      trend.year = year;
      trend.currency = currency;
      trend.strokeWidth = 3;
      trend.strokeDasharray = 4;
      if (trendAverageValue < 0) {
        trend.stroke = trend.fill = am4core.color("#ff3333");
      }
      else if (trendAverageValue > 0) {
        trend.stroke = trend.fill = am4core.color("#00FF7F");
      }
      else {
        trend.stroke = trend.fill = am4core.color("#ff8000");
      }
      trend.data = data;

      var bullet = trend.bullets.push(new am4charts.CircleBullet());
      bullet.tooltipText = "[bold]{year}[/] {valueY} {currency}[/]";
      bullet.strokeWidth = 2;
      bullet.stroke = trend.stroke;
      bullet.circle.fill = trend.stroke;
    
      var hoverState = bullet.states.create("hover");
      hoverState.properties.scale = 1.7;

      return trend;
    }

    const sumOfData = data.map(x => { return x.amount }).reduce((a, b) => a + b, 0);
    createTrendLine([
      { "date": data[data.length - 1].datemonth, "value": sumOfData },
      { "date": data[0].datemonth, "value": sumOfData }
    ], sumOfData, data[0].datemonth.substring(0, 4), scope.me.currency);
  }
}