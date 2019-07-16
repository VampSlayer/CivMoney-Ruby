<style>
.bar-chart {
  width: 100%;
  height: 95%;
}
</style>

<template>
  <div style="height:inherit">
    <div class="bar-chart" :id="id"></div>
  </div>
</template>

<script>
import graphing from "../services/graphing";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated.js";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
export default {
  name: "bar",
  props: {
    data: Array
  },
  data() {
    return {
      id: `${this._uid}bar`
    };
  },
  mounted: function() {
    this.draw();
  },
  methods: {
    draw() {
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_dark);
      // Create chart instance
      let chart = am4core.create(this.id, am4charts.XYChart);
      // Add data
      chart.data = this.data;

      var title = chart.titles.create();
      title.text = "Jan 2019";
      title.fontSize = 20;
      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "type";

      categoryAxis.renderer.grid.template.location = 0;

      categoryAxis.renderer.labels.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;

      categoryAxis.renderer.labels.template.events.on(
        "hit",
        event => {
          this.createPieData(event.event.explicitOriginalTarget.data);
        },
        this
      );

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.inside = true;

      // Create series
      function createSeries(field) {
        // Set up series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.name = field;
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "type";
        series.sequencedInterpolation = true;
        series.fillOpacity = 0.2;

        // Make it stacked
        series.stacked = true;

        // Configure columns
        series.columns.template.width = am4core.percent(60);
        series.columns.template.tooltipText =
          "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";

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
          createSeries(x);
        });
      });
    },
    createPieData(type) {
      let data = this.data.find(x => {
        return x.type === type;
      });
      console.log(data);
      let pieData = [];
      let keys = Object.keys(data).filter(x => {
        return x != "type";
      });
      keys.forEach(x => {
        let datum = {};
        datum["description"] = x;
        datum["amount"] = Math.abs(data[x]);
        pieData.push(datum);
      });
      let pieTitle = `Jan 2019 ${type}`;
      graphing.pie(this.id, pieData, pieTitle, this);
    }
  }
};
</script>

