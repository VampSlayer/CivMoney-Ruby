<template>
  <div class="h-inherit">
    <b-alert v-if="error" show variant="danger" dismissible>{{error}}</b-alert>
    <bar v-if="pieData.length === 0" :id="id" :data="data" :title="title" v-on:show-pie="showPie"></bar>
    <pie v-else :id="id" :data="pieData" :title="`${title} ${type}`" :type="type" v-on:hide-pie="hidePie"></pie>
  </div>
</template>

<script>
import { mapState } from "vuex";
import totals from "../services/totals";
import Bar from "./bar";
import Pie from "./pie";
import dateFormatter from '../services/dateFormatter';

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
          this.title = dateFormatter.format(this.month, "MMMM, YYYY");
          response = await totals.getMonthGroupedTotals(
            this.year,
            dateFormatter.format(this.month, "MM")
          );
        } else if (this.date && this.date.length > 0) {
          this.title = dateFormatter.format(this.date, "LL");
          response = await totals.getDateGroupedTotals(this.date);
        } else if (this.year && !isNaN(this.year)) {
          this.title = this.year.toString()
          response = await totals.getYearGroupedTotals(this.year);
        }
        let incomes = { type: "Incomes" };
        let expenses = { type: "Expenses" };
        let total = { type: "Total", Total: response.data.total };

        response.data.incomes.forEach(x => {
          incomes[x.description] = x.amount;
        })

        response.data.expenses.forEach(x => {
          expenses[x.description] = x.amount;
        })

        this.data = [incomes, expenses, total];
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
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
