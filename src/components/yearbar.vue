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

      let dateAxis = graphing.createDateAxis(chart, "datemonth", "MMMM");
        dateAxis.renderer.labels.template.events.on(
          "hit",
          event => {
            let month = "";
            if (event.event.explicitOriginalTarget) {
              month = [event.event.explicitOriginalTarget.data.split(" ")[0]];
            } else {
              month = event.event.target.innerHTML;
            }
            this.drawMonth(month);
          },
          this
        );

      let valueAxis = graphing.createValueAxis(chart, this.me.currency);

      let series = graphing.createSeries(
        chart,
        "datemonth",
        this.me.currency,
        this.theme
      );
        series.columns.template.events.on(
          "hit",
          event => {
            this.drawModalMonth(event.target.dataItem.dataContext.datemonth);
          },
          this
        );

      graphing.createSeriesRange(valueAxis, series);

      graphing.createTrendLine(chart, this.data, this.me.currency, this.theme);
    },
    drawMonth(month) {
      const months = {
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
      };
      if (!month) month = "Jan";
      this.$emit("draw-month", months[month]);
    },
    drawModalMonth(month) {
      if (!month) return;
      this.$emit("draw-month-modal", month);
    }
  }
};
</script>