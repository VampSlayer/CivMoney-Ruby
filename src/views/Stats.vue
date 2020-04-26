<template>
  <div>
    <div class="mt-2 h-100">
      <view-nav>
        <b-nav-item to="/">
          <i title="Dashboard" class="fas fa-chart-bar"></i>
        </b-nav-item>
        <b-nav-item to="/averages">
          <i title="Averages" class="fas fa-thermometer-empty"></i>
        </b-nav-item>
        <b-nav-item to="/year">
          <i title="Year" class="fas fa-signal"></i>
        </b-nav-item>
      </view-nav>
      <div class="h-100">
        <div class="row stats-border-btm">
          <div class="col-md-6 offset-md-3 h-100">
            <div class="text-center h-100">
              <pictorialbar :alignLabels="true" :data="selectedYearsStats"></pictorialbar>
            </div>
          </div>
        </div>
        <div class="row h-20">
          <div class="col" v-for="month in monthlyStatsForYear" :key="month.id">
            <pictorialbar
              :title="month.datemonth"
              :alignLabels="false"
              :data="{spent:month.spent, saved:month.saved}">
            </pictorialbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Pictorialbar from "../components/pictoralbar";
import ViewNav from "../components/viewnav";
import statsX from "../services/stats";
import moment from "moment";

export default {
  name: "Stats",
  data() {
    return {
      yearlyStats: [],
      monthlyStatsForYear: [],
      selectedYearsStats: {},
      error: null
    };
  },
  components: { Pictorialbar, ViewNav },
  created: function() {
    this.getYears();
    this.getYearlyStats();
    this.getMonthStatsForYear();
  },
  watch: {
    selectedYear: async function(val) {
      this.findSelectedYearsStats(val);
      this.getMonthStatsForYear();
    }
  },
  computed: {
    ...mapState(["years", "me", "selectedYear"])
  },
  methods: {
    ...mapActions(["getYears"]),
    async getYearlyStats() {
      try {
        const response = await statsX.years();
        this.yearlyStats = response.data;
        this.findSelectedYearsStats(this.selectedYear);
      } catch (error) {
        this.error = error;
      }
    },
    findSelectedYearsStats(year) {
      this.selectedYearsStats = this.yearlyStats.find(x => {
        return Number(x.dateyear) === Number(year);
      });
    },
    async getMonthStatsForYear() {
      try {
        const result = await statsX.getMonthStatsForYear(this.selectedYear);
        let monthlyStatsForYear = result.data;
        monthlyStatsForYear.forEach(x => {
          x.id = x.datemonth;
          x.datemonth = moment()
            .month(x.datemonth - 1)
            .format("MMMM");
        });
        this.monthlyStatsForYear = monthlyStatsForYear;
      } catch (error) {
        this.error = error;
      }
    }
  }
};
</script>