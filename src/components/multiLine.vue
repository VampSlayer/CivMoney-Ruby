<style scoped>
.multi-line-chart {
  height: 100%;
}
</style>

<template>
  <div style="height:inherit">
    <div class="multi-line-chart" :id="id"></div>
  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated.js";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
import { mapState } from "vuex";

export default {
  name: "multiLine",
  props: {
    data: Array
  },
  data() {
    return {
      id: `${this._uid}bar`
    };
  },
  watch: {
      'me.currency': function() {
        this.draw()
      },
      data: function(){
        this.draw()
      }
  },
  mounted() {
    this.draw();
  },
  computed: {
      ...mapState(["me"])
  },
  methods: {
    draw() {
      if(!this.data) return;
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_dark);
      var iconPath = this.iconPath;
      var chart = am4core.create(this.id, am4charts.XYChart);
      chart.colors.step = 2;

      chart.data = this.data

      // Create axes
      var valueAxisX = chart.xAxes.push(new am4charts.DateAxis());
      valueAxisX.renderer.minGridDistance = 50;
      valueAxisX.renderer.grid.template.location = 0.5;
      valueAxisX.dateFormats.setKey("datemonth", "MMMM");

      // Create value axis
      var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxisY.title.text = this.me.currency;
      valueAxisY.title.rotation = 0;

      // Create series
      var lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.name = `Average ${this.me.currency} Spent Per Day`
      lineSeries.dataFields.valueY = "spent";
      lineSeries.dataFields.dateX = "datemonth";
      lineSeries.stroke = "#ff3333"
      lineSeries.currency = this.me.currency;

      var lineSeries2 = chart.series.push(new am4charts.LineSeries());
      lineSeries2.name = `Average ${this.me.currency} Saved Per Day`
      lineSeries2.dataFields.valueY = "saved";
      lineSeries2.dataFields.dateX = "datemonth";
      lineSeries2.stroke = "#00FF7F"
      lineSeries2.currency = this.me.currency;

      // Add a bullet
      var bullet = lineSeries.bullets.push(new am4charts.Bullet());

      var bullet = bullet.createChild(am4core.Circle);
      bullet.horizontalCenter = "middle";
      bullet.verticalCenter = "middle";
      bullet.strokeWidth = 0;
      bullet.fill = "#ff3333"
      bullet.direction = "top";
      bullet.width = 12;
      bullet.height = 12;
      bullet.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      bullet.tooltipText = "Spent: {currency}[bold]{valueY}[/]";

      var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());
      var bullet2 = bullet2.createChild(am4core.Circle);
      bullet2.horizontalCenter = "middle";
      bullet2.verticalCenter = "middle";
      bullet2.strokeWidth = 0;
      bullet2.fill = "#00FF7F"
      bullet2.direction = "top";
      bullet2.width = 12;
      bullet2.height = 12;
      bullet2.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      bullet2.tooltipText = "Saved: {currency}[bold]{valueY}[/]";

      chart.legend = new am4charts.Legend();
    }
  }
};
</script>
