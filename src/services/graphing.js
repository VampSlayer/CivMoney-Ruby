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
    vodalBar(id, data, title, scope){
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
        valueAxis.title.text = `Total / ${scope.me.currency}`;
        valueAxis.renderer.inside = true;
        function createSeries(field, scope) {
          let series = chart.series.push(new am4charts.ColumnSeries());
          series.name = field;
          series.dataFields.valueY = field;
          series.dataFields.categoryX = "type";
          series.sequencedInterpolation = true;
          series.fillOpacity = 0.2;
          series.stacked = true;
          series.columns.template.width = am4core.percent(60);
          series.columns.template.tooltipText =
            "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
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
    graphMonth(id, data, scope){
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
      valueAxis.title.text = `Total / ${scope.me.currency}`;
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "amount";
      series.dataFields.dateX = "date";
      series.columns.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;
      series.columns.template.events.on(
        "hit",
        event => {
          scope.show = true;
          scope.selectedDate = event.target.dataItem.dataContext.date;
        },
        scope
      );
      series.columns.template.tooltipText = "[bold]{valueY}[/]";
      series.tensionX = 0.8;
      series.fillOpacity = 0.2;
      let range = valueAxis.createSeriesRange(series);
      range.value = 0;
      range.endValue = Number.MAX_SAFE_INTEGER;
      range.contents.stroke = chart.colors.getIndex(2);
      range.contents.fill = range.contents.stroke;
      range.contents.fillOpacity = 0.2;
    },
    graphYear(id, data, scope){
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
      valueAxis.title.text = `Total / ${scope.me.currency}`;
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "amount";
      series.dataFields.dateX = "datemonth";
      series.columns.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;
      series.columns.template.events.on(
        "hit",
        event => {
          scope.show = true;
          scope.monthBar = event.target.dataItem.dataContext.datemonth;
        },
        scope
      );
      series.columns.template.tooltipText = "[bold]{valueY}[/]";
      series.tensionX = 0.8;
      series.fillOpacity = 0.2;
      let range = valueAxis.createSeriesRange(series);
      range.value = 0;
      range.endValue = Number.MAX_SAFE_INTEGER;
      range.contents.stroke = chart.colors.getIndex(2);
      range.contents.fill = range.contents.stroke;
      range.contents.fillOpacity = 0.2;
    }
}