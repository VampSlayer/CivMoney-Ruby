<template>
  <div class="modal-graph" :id="id"></div>
</template>

<script>
import { mapState } from "vuex";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import graphing from "../services/graphing";

export default {
  name: "pie",
  props: {
    id: String,
    data: Array,
    title: String
  },
  mounted() {
    this.draw();
  },
  watch: {
    data: function() {
      this.draw();
    }
  },
  computed: {
    ...mapState(["me"])
  },
  methods: {
    draw: function() {
      if (!this.data || this.data.length === 0) return;
      graphing.useTheme(am4core);
      let chart = am4core.create(this.id, am4charts.PieChart);
      chart.data = this.data;
      let chartTitle = chart.titles.create();
      chartTitle.text = this.title;
      chartTitle.fontSize = 20;
      chartTitle.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      chartTitle.tooltipText = "Back";
      chartTitle.events.on(
        "hit",
        () => {
          this.$emit("hide-pie");
        },
        this
      );
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "amount";
      pieSeries.dataFields.category = "description";
      pieSeries.currency = this.me.currency;
      pieSeries.slices.template.fillOpacity = 0.2;
      pieSeries.slices.template.strokeWidth = 1;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.slices.template.tooltipText =
        "{category}: {value.percent.formatNumber('#.#')}% [bold]{currency}{value.value}[/]";
      pieSeries.labels.template.text = "";
      pieSeries.slices.template.cursorOverStyle = [
        {
          property: "cursor",
          value: "pointer"
        }
      ];
      pieSeries.hiddenState.properties.opacity = 0.2;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
    }
  }
};
</script>