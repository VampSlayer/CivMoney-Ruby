<template>
  <div id="dashboard-chart"></div>
</template>

<script>
import { mapState } from "vuex";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import graphing from "../services/graphing";

export default {
  name: "TotalBar",
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
      graphing.useTheme(am4core);

      let chart = am4core.create("dashboard-chart", am4charts.XYChart);
      chart.data = this.data;

      let dateAxis = graphing.createDateAxis(chart, "date", "YY");
      dateAxis.renderer.labels.template.events.on(
          "hit",
          event => {
            let year = "";
            if (event.event.explicitOriginalTarget) {
              year = event.event.explicitOriginalTarget.data.split(" ")[0];
            } else {
              year = event.event.target.innerHTML;
            }
            this.goToYear(year)
          },
          this
        );

      let valueAxis = graphing.createValueAxis(chart, this.me.currency);

      let series = graphing.createSeries(
        chart,
        "date",
        this.me.currency,
        this.theme
      );
      series.columns.template.events.on(
          "hit",
          event => {
            this.drawModalYear(event.target.dataItem.dataContext.date);
          },
          this
        );

      graphing.createSeriesRange(valueAxis, series);
    },
    goToYear(year) {
      this.$router.push({name: 'home', hash: `#${year}`})
    },
    drawModalYear(year) {
      if (!year) return;
      if (year.includes('/')) {
        year = year.split('/').slice(-1)[0]
      }
      this.$emit("draw-year-modal", year);
    }
  }
};
</script>