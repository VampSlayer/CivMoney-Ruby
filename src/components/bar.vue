<style>
.bar-chart {
  width: 100%;
  height: 95%;
}
</style>

<template>
  <div style="height:inherit">
    <div class="bar-chart" :id="id"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import graphing from "../services/graphing";
import totals from "../services/totals";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated.js";
import am4themes_dark from "@amcharts/amcharts4/themes/dark.js";
import moment from "moment";
export default {
  name: "bar",
  props: {
    year: Number,
    month: String,
    date: String
  },
  data() {
    return {
      id: `${this._uid}bar`,
      data: [],
      title: ""
    };
  },
    computed: {
    ...mapState(["me"])
  },
  watch: {
    year: function(){
      if(!this.year || !this.month || this.month === "") return;
      this.title = `${moment(this.month).format("MMM YYYY")}`;
      this.getTransactions("month");
    },
    month: function(){
      if(!this.month || this.month === "") return;
      this.title = `${moment(this.month).format("MMM YYYY")}`;
      this.getTransactions("month");
    },
    date: function(){
      if(!this.date || this.date === "") return;
      this.title = `${moment(this.date).format("LL")}`;
      this.getTransactions("date");
    }
  },
  methods: {
    async getTransactions(type){
      try{
        this.data = [];
        let response = {};
        switch (type) {
          case "month":
            response = await totals.getMonthGroupedToals(this.year, moment(this.month).format("MM"));
            break;
          case "date":
            response = await totals.getTransactionsForDate(this.date);
            break;
        }
        let incomes = {type: "Incomes"};
        let outgoings = {type: "Outgoings"};
        let total = {type: "Total", Total: 0};
        response.data.forEach(element => {
          total.Total += element.amount;
          if(element.amount > 0){
            incomes[element.description] = 0;
            incomes[element.description] += element.amount;  
          }
          if(element.amount < 0){
            outgoings[element.description] = 0;
            outgoings[element.description] += element.amount;
          }
        });
        this.data.push(incomes);
        this.data.push(outgoings);
        this.data.push(total);
        this.draw();
      }
      catch(error){
        console.error(error);
      }
    },
    draw() {
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_dark);
      // Create chart instance
      let chart = am4core.create(this.id, am4charts.XYChart);
      // Add data
      chart.data = this.data;

      var title = chart.titles.create();
      title.text = this.title;
      title.fontSize = 20;
      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "type";

      categoryAxis.renderer.grid.template.location = 0;

      categoryAxis.renderer.labels.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer;

      categoryAxis.renderer.labels.template.events.on(
        "hit",
        event => {
          this.createPieData(event.event.explicitOriginalTarget.data);
        },
        this
      );

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = `Total / ${this.me.currency}`;
      valueAxis.renderer.inside = true;

      // Create series
      function createSeries(field, scope) {
        // Set up series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.name = field;
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "type";
        series.sequencedInterpolation = true;
        series.fillOpacity = 0.2;

        // Make it stacked
        series.stacked = true;

        // Configure columns
        series.columns.template.width = am4core.percent(60);
        series.columns.template.tooltipText =
          "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
        series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        series.columns.template.events.on(
        "hit",
        event => {
          scope.createPieData(event.target.dataItem.dataContext.type);
        },
        scope);

        let labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "{valueY}";
        labelBullet.locationY = 0.5;

        return series;
      }

      chart.data.forEach(element => {
        let keys = Object.keys(element).filter(x => {
          return x != "type";
        });
        keys.forEach(x => {
          createSeries(x, this);
        });
      });
    },
    createPieData(type) {
      let data = this.data.find(x => {
        return x.type === type;
      });
      console.log(data);
      let pieData = [];
      let keys = Object.keys(data).filter(x => {
        return x != "type";
      });
      keys.forEach(x => {
        let datum = {};
        datum["description"] = x;
        datum["amount"] = Math.abs(data[x]);
        pieData.push(datum);
      });
      let pieTitle = `${this.title} ${type}`;
      graphing.pie(this.id, pieData, pieTitle, this);
    }
  }
};
</script>

