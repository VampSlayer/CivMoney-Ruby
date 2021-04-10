<template>
  <div>
    <div class="mt-2 h-100">
      <view-nav>
        <b-nav-item to="/">
          <i title="Dashboard" class="mi mi-AreaChart"></i>
        </b-nav-item>
        <b-nav-item to="/stats">
          <i title="Statistics" class="mi mi-CalculatorPercentage"></i>
        </b-nav-item>
      </view-nav>
      <div class="h-100">
        <div class="row h-100">
          <div class="col h-100">
            <tree-map :data="yearGroupedIncomes" :title="'Incomes'"></tree-map>
          </div>
          <div class="col h-100">
            <tree-map :data="yearGroupedExpenses" :title="'Expenses'"></tree-map>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ViewNav from "../components/viewnav";
import Total from "../services/totals";
import TreeMap from "../components/treemap";

export default {
  name: "YearGrouping",
  data() {
    return {
      yearGroupedIncomes: [],
      yearGroupedExpenses: [],
      error: null
    };
  },
  components: { ViewNav, TreeMap },
  created: function() {
    this.getYears();
    this.getYearGroupedTotals();
  },
  watch: {
    selectedYear: async function() {
      this.getYearGroupedTotals();
    }
  },
  computed: {
    ...mapState(["years", "me", "selectedYear"])
  },
  methods: {
    ...mapActions(["getYears"]),
    getYearGroupedTotals: async function() {
      if (!this.selectedYear) return;
      try {
        const result = await Total.getYearGroupedTotals(this.selectedYear);
        this.yearGroupedIncomes = result.data.incomes.map(x => {
          return {
            name: x.description,
            children: [
              {
                name: x.description,
                value: x.amount
              }
            ]
          };
        });
        this.yearGroupedExpenses = result.data.expenses.map(x => {
          return {
            name: x.description,
            children: [
              {
                name: x.description,
                value: Math.abs(x.amount)
              }
            ]
          };
        });
      } catch (error) {
        this.error = error;
      }
    }
  }
};
</script>