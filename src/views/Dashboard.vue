<style>
#chartdiv {
    width: 100%;
    height: 100%;
}
#me {
    height: 80vh;
}
</style>

<template>
  <div class="mt-4">
    <div>
      <b-nav align="right">
        <b-nav-item
          v-for="(year, index) in years"
          :key="index"
          :active="year === selectedYear"
          v-on:click="selectedYear = year.dateyear; selectedMonth = ''">
          {{ year.dateyear }}
        </b-nav-item>
      </b-nav>
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
      montlyTotalsForYear: [],
      error: "",
      months: [1,2,3,4,5,6,7,8,9,10,11,12],
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
      totalsPerDayForMonth: {}
    };
  },
  watch: {
    selectedMonth: function(newVal){
      if(newVal === '') this.getTotalPerMonthForYear();
      this.getTotalPerDayForMonth();
    },
    selectedYear: function(){
      this.getTotalPerMonthForYear();
    },
    years: function() {
      if (this.years){
        this.selectedYear = this.years[1].dateyear;
        this.getTotalPerMonthForYear();
      }
    }
  },
  created: function() {
    this.getYears();
  },
  computed: {
    ...mapState(["years", "me"])
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
      valueAxis.title.text = `Amount / ${this.me.currency}` ;

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
      am4core.useTheme(am4themes_dark);
      am4core.useTheme(am4themes_animated);
      // Create chart instance
      let chart = am4core.create("chartdiv", am4charts.XYChart);

      // Add data
      this.montlyTotalsForYear.forEach(x => {
        x.datemonth = moment(`${this.selectedYear}-${x.datemonth}-01`).format();
      });

      chart.data = this.montlyTotalsForYear;

      // Create axes
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 50;
      dateAxis.renderer.grid.template.location = 0.5;
      dateAxis.dateFormats.setKey("datemonth", "MMMM");
      console.log(dateAxis.renderer.labels)
      dateAxis.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      dateAxis.renderer.labels.template.events.on("hit", (event) => {
        this.selectedMonth = this.monthsMap[event.event.explicitOriginalTarget.data.split(' ')[0]];
      }, this)

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = `Amount / ${this.me.currency}` ;

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
    async getTotalPerMonthForYear() {
      try {
        var response = await totals.getTotalPerMonthForYear(this.selectedYear);
        let data = response.data;
        let months = []
        data.forEach(x => {
          months.push(x.datemonth);
        })
        this.months.forEach(x => {
          if(!months.includes(x)){
            data.push({
              amount: 0,
              datemonth: x
            })
          }
        })
        this.montlyTotalsForYear = data;
        this.graphYear();
      } catch (error) {
        this.error = error.repsonse.data;
      }
    },
    async getTotalPerDayForMonth() {
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
