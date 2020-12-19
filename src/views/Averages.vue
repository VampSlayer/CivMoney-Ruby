<template>
  <div>
    <div class="mt-2 h-100">
      <view-nav>
        <b-nav-item to="/">
          <i title="Dashboard" class="fas fa-chart-bar"></i>
        </b-nav-item>
        <b-nav-item to="/stats">
          <i title="Statistics" class="fa fa-percent"></i>
        </b-nav-item>
        <b-nav-item to="/year">
          <i title="Year" class="fas fa-signal"></i>
        </b-nav-item>
      </view-nav>
      <div class="h-100">
        <div class="text-center h-100">
          <multiLine :data="monthlyAvgsForYear"></multiLine>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import MultiLine from "../components/multiLine";
import ViewNav from "../components/viewnav";
import statsX from "../services/stats";

export default {
  name: "Averages",
  data() {
    return {
      monthlyAvgsForYear: [],
      error: null
    };
  },
  components: { MultiLine, ViewNav },
  created: function() {
    this.getYears();
    this.getMonthAvgsForYear();
  },
  watch: {
    selectedYear: async function() {
      this.getMonthAvgsForYear();
    }
  },
  computed: {
    ...mapState(["years", "me", "selectedYear"])
  },
  methods: {
    ...mapActions(["getYears"]),
    getMonthAvgsForYear: async function() {
      if (!this.selectedYear) return;
      try {
        const result = await statsX.getMonthAvgsForYear(this.selectedYear);
        this.monthlyAvgsForYear = result.data;
      } catch (error) {
        this.error = error;
      }
    }
  }
};
</script>