import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated.js";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
import moment from 'moment';
import store from '@/store';

export default {
  vodalPie(id, data, title, vm) {
    this.useTheme()
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
    pieSeries.currency = vm.me.currency;
    pieSeries.slices.template.fillOpacity = 0.2;
    pieSeries.slices.template.strokeWidth = 1;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.tooltipText = "{category}: {value.percent.formatNumber('#.#')}% [bold]{currency}{value.value}[/]";
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
    this.useTheme();
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
        if(event.event.explicitOriginalTarget){
          scope.createPieData(event.event.explicitOriginalTarget.data);
        }else{
          scope.createPieData(event.event.target.innerHTML);
        }
      },
      scope
    );
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = `${scope.me.currency}`;
    valueAxis.renderer.inside = true;
    valueAxis.title.rotation = 0;
    valueAxis.title.fontWeight = 'bolder';
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
            return am4core.color(store.state.theme.red);
          }
          else if (target.dataItem && (target.dataItem.valueY > 0)) {
            return am4core.color(store.state.theme.green);
          }
          else {
            return am4core.color(store.state.theme.orange);
          }
        });
        series.columns.template.adapter.add("fill", function (fill, target) {
          if (target.dataItem && (target.dataItem.valueY < 0)) {
            return am4core.color(store.state.theme.red);
          }
          else if (target.dataItem && (target.dataItem.valueY > 0)) {
            return am4core.color(store.state.theme.green);
          }
          else {
            return am4core.color(store.state.theme.orange);
          }
        });
      }
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText =
        "[bold]{name}[/]\n[font-size:14px]{currency}{valueY}";
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
    this.useTheme()
    let chart = am4core.create(id, am4charts.XYChart);
    chart.data = data;
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.dateFormats.setKey("datemonth", "DD");
    dateAxis.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    dateAxis.renderer.labels.template.events.on(
      "hit",
      event => {
        scope.show = true;
        scope.selectedDate = moment(event.target.dataItem.dates.date).format('YYYY-MM-DD');
      },
      scope
    );
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = `${scope.me.currency}`;
    valueAxis.title.fontWeight = 'bolder';
    valueAxis.title.rotation = 0;
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "amount";
    series.dataFields.dateX = "date";
    series.currency = scope.me.currency;
    series.columns.template.adapter.add("stroke", function (fill, target) {
      if (target.dataItem && (target.dataItem.valueY < 0)) {
        return am4core.color(store.state.theme.red);
      }
      else if (target.dataItem && (target.dataItem.valueY > 0)) {
        return am4core.color(store.state.theme.green);
      }
      else {
        return am4core.color(store.state.theme.orange);
      }
    });
    series.columns.template.adapter.add("fill", function (fill, target) {
      if (target.dataItem && (target.dataItem.valueY < 0)) {
        return am4core.color(store.state.theme.red);
      }
      else if (target.dataItem && (target.dataItem.valueY > 0)) {
        return am4core.color(store.state.theme.green);
      }
      else {
        return am4core.color(store.state.theme.orange);
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
    series.columns.template.tooltipText = "[bold]{currency}{valueY}[/]";
    series.fillOpacity = 0.5;

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "amount";
    lineSeries.dataFields.dateX = "date";
    lineSeries.tensionX = 0.7;
    lineSeries.stroke = am4core.color(store.state.theme.yearLine);
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
        trend.stroke = trend.fill = am4core.color(store.state.theme.red);
      }
      else if (trendAverageValue > 0) {
        trend.stroke = trend.fill = am4core.color(store.state.theme.green);
      }
      else {
        trend.stroke = trend.fill = am4core.color(store.state.theme.orange);
      }
      trend.data = data;

      var bullet = trend.bullets.push(new am4charts.CircleBullet());
      bullet.tooltipText = "{currency}{valueY}[/]";
      bullet.strokeWidth = 2;
      bullet.stroke = trend.stroke;
      bullet.circle.fill = trend.stroke;
      bullet.circle.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    
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
    this.useTheme()
    let chart = am4core.create(id, am4charts.XYChart);
    chart.data = data;
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.dateFormats.setKey("datemonth", "MMMM");
    dateAxis.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    dateAxis.renderer.labels.template.events.on(
      "hit",
      event => {
        let month = '';
        if(event.event.explicitOriginalTarget){
          month = [event.event.explicitOriginalTarget.data.split(" ")[0]];
        }else{
          month = event.event.target.innerHTML;
        }
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
        }[month];
        if(!scope.selectedMonth) scope.selectedMonth = "01";
      },
      scope
    );
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = `${scope.me.currency}`;
    valueAxis.title.fontWeight = 'bolder';
    valueAxis.title.rotation = 0;
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "amount";
    series.dataFields.dateX = "datemonth";
    series.currency = scope.me.currency;
    series.columns.template.adapter.add("stroke", function (fill, target) {
      if (target.dataItem && (target.dataItem.valueY < 0)) {
        return am4core.color(store.state.theme.red);
      }
      else if (target.dataItem && (target.dataItem.valueY > 0)) {
        return am4core.color(store.state.theme.green);
      }
      else {
        return am4core.color(store.state.theme.orange);
      }
    });
    series.columns.template.adapter.add("fill", function (fill, target) {
      if (target.dataItem && (target.dataItem.valueY < 0)) {
        return am4core.color(store.state.theme.red);
      }
      else if (target.dataItem && (target.dataItem.valueY > 0)) {
        return am4core.color(store.state.theme.green);
      }
      else {
        return am4core.color(store.state.theme.orange);
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
    series.columns.template.tooltipText = "[bold]{currency}{valueY}[/]";
    series.fillOpacity = store.state.theme.luminosity > 0.5 ? 0.8 : 0.5;

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "amount";
    lineSeries.dataFields.dateX = "datemonth";
    lineSeries.tensionX = 0.7;
    lineSeries.stroke = am4core.color(store.state.theme.yearLine);
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
        trend.stroke = trend.fill = am4core.color(store.state.theme.red);
      }
      else if (trendAverageValue > 0) {
        trend.stroke = trend.fill = am4core.color(store.state.theme.green);
      }
      else {
        trend.stroke = trend.fill = am4core.color(store.state.theme.orange);
      }
      trend.data = data;

      var bullet = trend.bullets.push(new am4charts.CircleBullet());
      bullet.tooltipText = "[bold]{year}[/]: {currency}{valueY}[/]";
      bullet.strokeWidth = 2;
      bullet.stroke = trend.stroke;
      bullet.circle.fill = trend.stroke;
      bullet.circle.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    
      var hoverState = bullet.states.create("hover");
      hoverState.properties.scale = 1.7;

      return trend;
    }

    const sumOfData = data.map(x => { return x.amount }).reduce((a, b) => a + b, 0);
    createTrendLine([
      { "date": data[data.length - 1].datemonth, "value": sumOfData },
      { "date": data[0].datemonth, "value": sumOfData }
    ], sumOfData, data[0].datemonth.substring(0, 4), scope.me.currency);
  },
  am4themes_customText(target) {
    if (target instanceof am4core.InterfaceColorSet) {
      target.setFor("text", am4core.color(store.state.theme.chartText));
    }
  },
  useTheme(){
    this.useThemeExternal(am4core)
  },
  useThemeExternal(am4core_ext){
    am4core_ext.unuseAllThemes();
    am4core_ext.useTheme(am4themes_animated);
    if (store.state.theme.luminosity === 0) {
      am4core_ext.useTheme(am4themes_dark);
    }
    am4core_ext.useTheme(this.am4themes_customText);
  }
}