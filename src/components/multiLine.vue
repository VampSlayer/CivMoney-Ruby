<template>
  <div class="h-inherit">
    <div class="h-100" :id="id"></div>
  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { mapState } from "vuex";
import graphing from "../services/graphing";

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
      "me.currency": function() {
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
      ...mapState(["me","theme"])
  },
  methods: {
    draw() {
      if(!this.data) return;
      graphing.useTheme(am4core)
      var chart = am4core.create(this.id, am4charts.XYChart);
      chart.colors.step = 2;

      chart.data = this.data

      // Create axes
      var valueAxisX = chart.xAxes.push(new am4charts.DateAxis());
      valueAxisX.renderer.minGridDistance = 50;
      valueAxisX.renderer.grid.template.location = 0.5;
      valueAxisX.dateFormats.setKey("date", "MMMM");

      // Create value axis
      var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxisY.title.text = this.me.currency;
      valueAxisY.title.rotation = 0;

      // Create series
      var lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.name = `Average ${this.me.currency} Spent Per Day`
      lineSeries.dataFields.valueY = "spent";
      lineSeries.dataFields.dateX = "date";
      lineSeries.stroke = am4core.color(this.theme.red)
      lineSeries.strokeWidth = 3;
      lineSeries.strokeOpacity = 0.75;
      lineSeries.currency = this.me.currency;

      var lineSeries2 = chart.series.push(new am4charts.LineSeries());
      lineSeries2.name = `Average ${this.me.currency} Saved Per Day`
      lineSeries2.dataFields.valueY = "saved";
      lineSeries2.dataFields.dateX = "date";
      lineSeries2.stroke = am4core.color(this.theme.green)
      lineSeries2.strokeWidth = 3;
      lineSeries2.strokeOpacity = 0.75;
      lineSeries2.currency = this.me.currency;

      // Add a bullet
      var bullet = lineSeries.bullets.push(new am4charts.Bullet());
      var circle = bullet.createChild(am4core.Circle);
      circle.horizontalCenter = "middle";
      circle.verticalCenter = "middle";
      circle.strokeWidth = 0;
      circle.fill = am4core.color(this.theme.red)
      circle.direction = "top";
      circle.width = 12;
      circle.height = 12;
      circle.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      circle.tooltipText = "Spent: {currency}[bold]{valueY}[/]";

      var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());
      var circle2 = bullet2.createChild(am4core.Circle);
      circle2.horizontalCenter = "middle";
      circle2.verticalCenter = "middle";
      circle2.strokeWidth = 0;
      circle2.fill = am4core.color(this.theme.green)
      circle2.direction = "top";
      circle2.width = 12;
      circle2.height = 12;
      circle2.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      circle2.tooltipText = "Saved: {currency}[bold]{valueY}[/]";

      chart.legend = new am4charts.Legend();
    }
  }
};
</script>
