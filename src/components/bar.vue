<style>
.bar-chart {
  width: 100%;
  height: 95%;
}
</style>

<template>
  <div style="height:inherit">
    <b-alert v-if="error" show variant="danger" dismissible>{{error}}</b-alert>
    <div class="bar-chart" :id="id"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import graphing from "../services/graphing";
import totals from "../services/totals";
import moment from "moment";
export default {
  name: "bar",
  props: {
    year: Number || String,
    month: String,
    date: String
  },
  data() {
    return {
      id: `${this._uid}bar`,
      data: [],
      title: "",
      error: ""
    };
  },
    computed: {
    ...mapState(["me"])
  },
  watch: {
    year: function(){
      if(!this.year || !this.month || this.month === "") return;
      this.title = `${moment(this.month).format("LL")}`;
      this.getTransactions("month");
    },
    month: function(){
      if(!this.month || this.month === "") return;
      this.title = `${moment(this.month).format("MMMM, YYYY")}`;
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
        document.getElementById(this.id).innerHTML = '';
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
            if(element.description in incomes){
              incomes[element.description] += element.amount;  
            }else{  
              incomes[element.description] = element.amount;
            }
          }
          if(element.amount < 0){
            if(element.description in outgoings){ 
              outgoings[element.description] += element.amount;
            }else{
              outgoings[element.description] = element.amount;
            }
          }
        });
        this.data.push(incomes);
        this.data.push(outgoings);
        this.data.push(total);  
        graphing.vodalBar(this.id, this.data, this.title, this);
      }
      catch(error){
        this.error = error;
      }
    },
    drawVodalBar: function(){
      graphing.vodalBar(this.id, this.data, this.title, this);
    },
    createPieData(type) {
      let data = this.data.find(x => {
        return x.type === type;
      });
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
      graphing.vodalPie(this.id, pieData, pieTitle, this);
    }
  }
};
</script>

