<template>
  <div id="dashboard-chart"></div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { mapState } from "vuex";
import moment from "moment";
import graphing from "../services/graphing";

export default {
  name: "MonthBar",
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
      graphing.useThemeExternal(am4core);

      let chart = am4core.create("dashboard-chart", am4charts.XYChart);
      chart.data = this.data;

      let dateAxis = graphing.createDateAxis(chart, "datemonth", "DD");
        dateAxis.renderer.labels.template.events.on(
          "hit",
          event => {
            this.drawDateModal(
              moment(event.target.dataItem.dates.date).format("YYYY-MM-DD")
            );
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
            this.drawDateModal(event.target.dataItem.dataContext.date);
          },
          this
        );

      graphing.createSeriesRange(valueAxis, series);

      graphing.createTrendLine(chart, this.data, this.me.currency, this.theme);
    },
    drawDateModal(date) {
      if (!date) return;
      this.$emit("draw-date-modal", date);
    }
  }
};
</script>