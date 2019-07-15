<style>
#chartdiv {
    width: 100%;
    height: 100%;
}
#me {
    height: 80vh;
}
.nav-item .active{
  color:white !important;
  /* font-weight: bold; */
}
</style>

<template>
  <div class="mt-4">
    <div class="row">
      <div class="col-4">
      <b-nav align="left">
        <b-nav-item><i title="Add a Transaction" class="fa fa-plus"></i></b-nav-item>
        <b-nav-item><i title="Add Monthly Transactions" class="fa fa-calendar"></i></b-nav-item>
        <b-nav-item><i title="Search Transactions" class="fa fa-search"></i></b-nav-item>
      </b-nav>
      </div>
      <div class="col-8">
      <b-nav align="right">
        <b-nav-item
          active-class="year-active"
          v-for="(year, index) in selectableYears"
          :key="index"
          :active="year === selectedYear"
          v-on:click="selectedYear = year; selectedMonth = ''">
          {{ year }}
        </b-nav-item>
      </b-nav>
      </div>
    </div>
    <div id="me" class="row">
        <div id="chartdiv">
        </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import totals from "../services/totals";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
import am4themes_animated from "@amcharts/amcharts4/themes/animated.js";
import moment from 'moment';
export default {
  name: "dashboard",
  data() {
    return {
      selectedYear: "",
      error: "",
      monthsMap: {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12'
      },
      selectedMonth: "",
      totalsPerDayForMonth: []
    };
  },
  watch: {
    selectedMonth: function(newVal){
      if(newVal === '') this.graphYear();
      this.getTotalPerDayForMonth();
    },
    selectedYear: function(){
      this.graphYear();
    },
    selectableYears: function(){
      if(this.selectableYears.length > 0){
        this.selectedYear = this.selectableYears[this.selectableYears.length - 1];
      }
    }
  },
  created: function() {
    this.getYears();
  },
  computed: {
    ...mapState(["years", "me", "selectableYears"])
  },
  methods: {
    graphMonth() {
      am4core.useTheme(am4themes_dark);
      am4core.useTheme(am4themes_animated);
      // Create chart instance
      let chart = am4core.create("chartdiv", am4charts.XYChart);

      chart.data = this.totalsPerDayForMonth;

      // Create axes
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 50;
      dateAxis.renderer.grid.template.location = 0.5;
      dateAxis.dateFormats.setKey("datemonth", "DD");
      console.log(dateAxis.renderer.labels);
      dateAxis.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = `Total / ${this.me.currency}` ;

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "amount";
      series.dataFields.dateX = "date";
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      series.columns.template.events.on("hit", (event) => {
        console.log(event);
      }, this)
      series.columns.template.tooltipText = "[bold]{valueY}[/]";
      series.tensionX = 0.8;
      series.fillOpacity = 0.2;

      let range = valueAxis.createSeriesRange(series);
      range.value = 0;
      range.endValue = Number.MAX_SAFE_INTEGER;
      range.contents.stroke = chart.colors.getIndex(2);
      range.contents.fill = range.contents.stroke;
      range.contents.fillOpacity = 0.2;
    },
    graphYear() {
      let data = this.years[this.selectedYear].months;
      am4core.useTheme(am4themes_dark);
      am4core.useTheme(am4themes_animated);
      // Create chart instance
      let chart = am4core.create("chartdiv", am4charts.XYChart);

      // Add data
      chart.data = this.years[this.selectedYear].months;

      // Create axes
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 50;
      dateAxis.renderer.grid.template.location = 0.5;
      dateAxis.dateFormats.setKey("datemonth", "MMMM");
      dateAxis.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      dateAxis.renderer.labels.template.events.on("hit", (event) => {
        this.selectedMonth = this.monthsMap[event.event.explicitOriginalTarget.data.split(' ')[0]];
      }, this)

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = `Total / ${this.me.currency}` ;

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "amount";
      series.dataFields.dateX = "datemonth";
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      series.columns.template.events.on("hit", (event) => {
        console.log(event);
      }, this)
      series.columns.template.tooltipText = "[bold]{valueY}[/]";
      series.tensionX = 0.8;
      series.fillOpacity = 0.2;

      let range = valueAxis.createSeriesRange(series);
      range.value = 0;
      range.endValue = Number.MAX_SAFE_INTEGER;
      range.contents.stroke = chart.colors.getIndex(2);
      range.contents.fill = range.contents.stroke;
      range.contents.fillOpacity = 0.2;
    },
    ...mapActions(["getYears"]),
    async getTotalPerDayForMonth() {
      if(!this.selectedMonth) return;
      try {
        var response = await totals.getTotalPerDayForMonth(this.selectedYear, this.selectedMonth);
        this.totalsPerDayForMonth = response.data;
        this.graphMonth();
      } catch (error) {
        this.error = error.repsonse.data;
      }
    }
  }
};
</script>
