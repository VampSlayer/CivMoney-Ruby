import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated.js";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
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
  },
  createTrendLine(data, chart, currency, theme){
    const sumOfData = data
    .map(x => {
      return x.amount;
    })
    .reduce((a, b) => a + b, 0);

    let trend = chart.series.push(new am4charts.LineSeries());
      trend.dataFields.valueY = "value";
      trend.dataFields.dateX = "date";
      trend.currency = currency;
      trend.strokeWidth = 3;
      trend.strokeDasharray = 4;
      if (sumOfData < 0) {
        trend.stroke = trend.fill = am4core.color(theme.red);
      } else if (sumOfData > 0) {
        trend.stroke = trend.fill = am4core.color(theme.green);
      } else {
        trend.stroke = trend.fill = am4core.color(theme.orange);
      }
      
      const dataFirstDate = data[0].date || data[0].datemonth
      const dataLastDate = data[data.length - 1].date || data[data.length - 1].datemonth
      const trendData = [
        { date: dataLastDate, value: sumOfData },
        { date: dataFirstDate, value: sumOfData }
      ]
      trend.data = trendData;

      let bullet = trend.bullets.push(new am4charts.CircleBullet());
      bullet.tooltipText = "{currency}{valueY}[/]";
      bullet.strokeWidth = 2;
      bullet.stroke = trend.stroke;
      bullet.circle.fill = trend.stroke;
      bullet.circle.cursorOverStyle = am4core.MouseCursorStyle.pointer;

      let hoverState = bullet.states.create("hover");
      hoverState.properties.scale = 1.7;
  }
}