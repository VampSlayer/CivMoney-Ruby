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
              <pictorialbar :alignLabels="true" :data="yearsStats"></pictorialbar>
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
import dateFormatter from '../services/dateFormatter'

export default {
  name: "Stats",
  data() {
    return {
      monthlyStatsForYear: [],
      yearsStats: {},
      error: null
    };
  },
  components: { Pictorialbar, ViewNav },
  created: function() {
    this.getYears();
    this.getStatsForYear();
    this.getMonthStatsForYear();
  },
  watch: {
    selectedYear: async function() {
      this.getStatsForYear();
      this.getMonthStatsForYear();
    }
  },
  computed: {
    ...mapState(["years", "me", "selectedYear"])
  },
  methods: {
    ...mapActions(["getYears"]),
    async getStatsForYear() {
      if (!this.selectedYear) return;
      try {
        const response = await statsX.getStatsForYear(this.selectedYear);
        this.yearsStats = response.data;
      } catch (error) {
        this.error = error;
      }
    },
    async getMonthStatsForYear() {
      if (!this.selectedYear) return;
      try {
        const result = await statsX.getMonthStatsForYear(this.selectedYear);
        let monthlyStatsForYear = result.data;
        // TODO: move to back end
        monthlyStatsForYear.forEach(x => {
          x.id = x.datemonth;
          x.datemonth = dateFormatter.months(x.datemonth - 1, true)
        });
        this.monthlyStatsForYear = monthlyStatsForYear;
      } catch (error) {
        this.error = error;
      }
    }
  }
};
</script>