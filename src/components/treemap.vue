<style scoped>
.treemap-chart {
  height: 100%;
}
</style>

<template>
  <div class="h-inherit">
    <div class="treemap-chart" :id="id"></div>
  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated.js";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
import { mapState } from "vuex";
export default {
  name: "treeMap",
  props: {
    data: Array,
    title: String
  },
  data() {
    return {
      id: `${this._uid}bar`
    };
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
    ...mapState(["me"])
  },
  methods: {
    draw: function() {
      am4core.useTheme(am4themes_animated);
      if (window.civmoney.luminosity < 0.5) am4core.useTheme(am4themes_dark);
      var chart = am4core.create(this.id, am4charts.TreeMap);
      chart.hiddenState.properties.opacity = 0; 
      chart.data = this.data;

      chart.colors.step = 2;
      let chartTitle = chart.titles.create();
      chartTitle.text = this.title;
      chartTitle.fontSize = 20;

      chart.dataFields.value = "value";
      chart.dataFields.name = "name";
      chart.dataFields.children = "children";
      chart.currency = this.me.currency;

      var level0SeriesTemplate = chart.seriesTemplates.create("0");
      var level0ColumnTemplate = level0SeriesTemplate.columns.template;

      level0ColumnTemplate.column.cornerRadius(10, 10, 10, 10);
      level0ColumnTemplate.fillOpacity = 0;
      level0ColumnTemplate.strokeWidth = 4;
      level0ColumnTemplate.stroke = am4core.color(window.civmoney.background);
      level0ColumnTemplate.strokeOpacity = 0;

      var level1SeriesTemplate = chart.seriesTemplates.create("1");
      var level1ColumnTemplate = level1SeriesTemplate.columns.template;

      level1SeriesTemplate.tooltip.animationDuration = 0;
      level1SeriesTemplate.strokeOpacity = 1;

      level1ColumnTemplate.column.cornerRadius(10, 10, 10, 10);
      level1ColumnTemplate.fillOpacity = 0.9;
      level1ColumnTemplate.strokeWidth = 4;
      level1ColumnTemplate.stroke = am4core.color(window.civmoney.background);
      level1ColumnTemplate.tooltipText = "{name}: {currency}[bold]{value}[/]";

      var bullet1 = level1SeriesTemplate.bullets.push(
        new am4charts.LabelBullet()
      );
      bullet1.locationY = 0.5;
      bullet1.locationX = 0.5;
      bullet1.label.text = "{name}";
      bullet1.label.fill = am4core.color("white");

      chart.maxLevels = 2;
    }
  }
};
</script>