import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated.js";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
import store from "../store";

export default {
  am4themes_customText(target) {
    if (target instanceof am4core.InterfaceColorSet) {
      target.setFor("text", am4core.color(store.state.theme.chartText));
    }
  },
  useTheme(am4core_ext) {
    am4core_ext.unuseAllThemes();
    am4core_ext.useTheme(am4themes_animated);
    if (store.state.theme.luminosity <= 0.5) {
      am4core_ext.useTheme(am4themes_dark);
    }
    am4core_ext.useTheme(this.am4themes_customText);
  },
  createTrendLine(chart, data, currency, theme) {
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

    const dataFirstDate = data[0].date
    const dataLastDate = data[data.length - 1].date
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
  },
  createDateAxis(chart, key, format) {
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.grid.template.location = 0.5;
    dateAxis.dateFormats.setKey(key, format);
    dateAxis.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    return dateAxis;
  },
  createSeries(chart, dateX, currency, theme) {
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "amount";
    series.dataFields.dateX = dateX;
    series.currency = currency;
    series.columns.template.adapter.add("stroke", (fill, target) => {
      if (target.dataItem && target.dataItem.valueY < 0) {
        return am4core.color(theme.red);
      } else if (target.dataItem && target.dataItem.valueY > 0) {
        return am4core.color(theme.green);
      } else {
        return am4core.color(theme.orange);
      }
    });
    series.columns.template.adapter.add("fill", (fill, target) => {
      if (target.dataItem && target.dataItem.valueY < 0) {
        return am4core.color(theme.red);
      } else if (target.dataItem && target.dataItem.valueY > 0) {
        return am4core.color(theme.green);
      } else {
        return am4core.color(theme.orange);
      }
    });
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series.columns.template.tooltipText = "[bold]{currency}{valueY}[/]";
    series.fillOpacity = theme.luminosity;

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.valueY = "amount";
    lineSeries.dataFields.dateX = dateX;
    lineSeries.tensionX = 0.7;
    lineSeries.stroke = am4core.color(theme.yearLine);
    lineSeries.strokeWidth = 3;
    lineSeries.strokeOpacity = 0.75;

    return series;
  },
  createValueAxis(chart, currency) {
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = `${currency}`;
    valueAxis.title.fontWeight = "bolder";
    valueAxis.title.rotation = 0;

    return valueAxis;
  },
  createSeriesRange(valueAxis, series) {
    let range = valueAxis.createSeriesRange(series);
    range.value = -Number.MAX_SAFE_INTEGER;
    range.endValue = Number.MAX_SAFE_INTEGER;
  }
}