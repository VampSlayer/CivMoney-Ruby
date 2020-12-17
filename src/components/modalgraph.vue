<template>
  <div class="h-inherit">
    <b-alert v-if="error" show variant="danger" dismissible>{{error}}</b-alert>
    <bar v-if="pieData.length === 0" :id="id" :data="data" :title="title" v-on:show-pie="showPie"></bar>
    <pie v-else :id="id" :data="pieData" :title="`${title} ${type}`" :type="type" v-on:hide-pie="hidePie"></pie>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import totals from "../services/totals";
import transactions from "../services/transactions";
import Bar from "./bar";
import Pie from "./pie";

export default {
  name: "modalgraph",
  components: { Bar, Pie },
  props: {
    year: Number || String,
    month: String,
    date: String,
    showing: Boolean
  },
  data() {
    return {
      id: `${this._uid}-graph`,
      data: [],
      pieData: [],
      title: "",
      error: "",
      type: ""
    };
  },
  computed: {
    ...mapState(["me"])
  },
  watch: {
    showing: function(val) {
      if (val) {
        this.getTransactions();
      } else {
        this.data = [];
        this.pieData = [];
        this.title = "";
        this.error = "";
      }
    }
  },
  methods: {
    async getTransactions() {
      try {
        document.getElementById(this.id).innerHTML = "";
        this.data = [];
        let response = {};
        if (this.month && this.month.length > 0) {
          this.title = moment(this.month).utc().format("MMMM, YYYY");
          response = await totals.getMonthGroupedTotals(
            this.year,
            moment(this.month).utc().format("MM")
          );
        } else if (this.date && this.date.length > 0) {
          this.title = moment(this.date).utc().format("LL");
          response = await transactions.getTransactionsForDate(this.date);
        } else if (this.year && !isNaN(this.year)) {
          this.title = this.year.toString()
          response = await totals.getYearGroupedTotals(this.year);
        }
        let incomes = { type: "Incomes" };
        let outgoings = { type: "Expenses" };
        let total = { type: "Total", Total: 0 };
        // TODO: move to back end
        response.data.forEach(element => {
          total.Total += element.amount;
          if (element.amount > 0) {
            if (element.description in incomes) {
              incomes[element.description] += element.amount;
            } else {
              incomes[element.description] = element.amount;
            }
          }
          if (element.amount < 0) {
            if (element.description in outgoings) {
              outgoings[element.description] += element.amount;
            } else {
              outgoings[element.description] = element.amount;
            }
          }
        });
        this.data.push(incomes);
        this.data.push(outgoings);
        this.data.push(total);
      } catch (error) {
        this.error = error;
      }
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
      this.pieData = pieData;
    },
    showPie(type) {
      if (type === "Total") return;
      this.type = type;
      this.createPieData(type);
    },
    hidePie() {
      this.type = "";
      this.pieData = [];
    }
  }
};
</script>
