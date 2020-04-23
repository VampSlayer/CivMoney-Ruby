<template>
  <div id="dashboard-chart"></div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { mapState } from "vuex";
import graphing from "../services/graphing";

export default {
  name: "YearBar",
  props: {
    data: Array
  },
  mounted() {
    this.draw();
  },
  watch: {
    "me.currency": function() {
      this.draw();
    },
    data: function() {
      this.draw();
    }
  },
  computed: {
    ...mapState(["me", "theme"])
  },
  methods: {
    draw() {
      if (!this.data || this.data.length === 0) return;
      graphing.useTheme();
      let chart = am4core.create("dashboard-chart", am4charts.XYChart);
      chart.data = this.data;
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 50;
      dateAxis.renderer.grid.template.location = 0.5;
      dateAxis.dateFormats.setKey("datemonth", "MMMM");
      dateAxis.renderer.labels.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;
      dateAxis.renderer.labels.template.events.on(
        "hit",
        event => {
          let month = "";
          if (event.event.explicitOriginalTarget) {
            month = [event.event.explicitOriginalTarget.data.split(" ")[0]];
          } else {
            month = event.event.target.innerHTML;
          }
          this.drawMonth(
            {
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
            }[month]
          );
        },
        this
      );
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = `${this.me.currency}`;
      valueAxis.title.fontWeight = "bolder";
      valueAxis.title.rotation = 0;
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "amount";
      series.dataFields.dateX = "datemonth";
      series.currency = this.me.currency;
      series.columns.template.adapter.add("stroke", (fill, target) => {
        if (target.dataItem && target.dataItem.valueY < 0) {
          return am4core.color(this.theme.red);
        } else if (target.dataItem && target.dataItem.valueY > 0) {
          return am4core.color(this.theme.green);
        } else {
          return am4core.color(this.theme.orange);
        }
      });
      series.columns.template.adapter.add("fill", (fill, target) => {
        if (target.dataItem && target.dataItem.valueY < 0) {
          return am4core.color(this.theme.red);
        } else if (target.dataItem && target.dataItem.valueY > 0) {
          return am4core.color(this.theme.green);
        } else {
          return am4core.color(this.theme.orange);
        }
      });
      series.columns.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;
      series.columns.template.events.on(
        "hit",
        event => {
          this.drawModalMonth(event.target.dataItem.dataContext.datemonth);
        },
        this
      );
      series.columns.template.tooltipText = "[bold]{currency}{valueY}[/]";
      series.fillOpacity = this.theme.luminosity > 0.5 ? 0.8 : 0.5;

      let lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.dataFields.valueY = "amount";
      lineSeries.dataFields.dateX = "datemonth";
      lineSeries.tensionX = 0.7;
      lineSeries.stroke = am4core.color(this.theme.yearLine);
      lineSeries.strokeWidth = 3;
      lineSeries.strokeOpacity = 0.75;

      let range = valueAxis.createSeriesRange(series);
      range.value = -Number.MAX_SAFE_INTEGER;
      range.endValue = Number.MAX_SAFE_INTEGER;

      graphing.createTrendLine(this.data, chart, this.me.currency, this.theme)
    },
    drawMonth(month) {
      if (!month) month = "01";
      this.$emit("draw-month", month);
    },
    drawModalMonth(month) {
      if (!month) return;
      this.$emit("draw-month-modal", month);
    }
  }
};
</script>