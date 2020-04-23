<template>
  <div class="modal-graph" :id="id"></div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import graphing from "../services/graphing";
import { mapState } from "vuex";

export default {
  name: "bar",
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
    ...mapState(["me", "theme"])
  },
  methods: {
    draw: function() {
      if (!this.data || this.data.length === 0) return;
      graphing.useTheme(am4core);
      let chart = am4core.create(this.id, am4charts.XYChart);
      chart.data = this.data;
      var chartTitle = chart.titles.create();
      chartTitle.text = this.title;
      chartTitle.fontSize = 20;
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "type";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      categoryAxis.renderer.labels.template.events.on(
        "hit",
        event => {
          if (event.event.explicitOriginalTarget) {
            this.showPie(event.event.explicitOriginalTarget.data);
          } else {
            this.showPie(event.event.target.innerHTML);
          }
        },
        this
      );
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = `${this.me.currency}`;
      valueAxis.renderer.inside = true;
      valueAxis.title.rotation = 0;
      valueAxis.title.fontWeight = "bolder";

      chart.data.forEach(element => {
        let keys = Object.keys(element).filter(x => {
          return x != "type";
        });
        keys.forEach(x => {
          this.createSeries(chart, x);
        });
      });
    },
    createSeries(chart, field) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.name = field;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "type";
      series.currency = this.me.currency;
      series.sequencedInterpolation = true;
      series.fillOpacity = 0.5;
      series.stacked = true;
      if (field === "Total") {
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
      }
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText =
        "[bold]{name}[/]\n[font-size:14px]{currency}{valueY}";
      series.columns.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;
      series.columns.template.events.on(
        "hit",
        event => {
          this.showPie(event.target.dataItem.dataContext.type);
        },
        this
      );
      let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;
      return series;
    },
    showPie: function(type) {
      this.$emit("show-pie", type);
    }
  }
};
</script>