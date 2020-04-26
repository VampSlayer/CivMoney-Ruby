<template>
  <div class="col-8">
    <b-nav align="right">
      <b-nav-item
        active-class="year-active"
        v-for="(year, index) in selectableYears"
        :key="index"
        :active="year == selectedYear"
        v-on:click="updateSelectedYearAndRoute(year)">
          {{ year }}
        </b-nav-item>
    </b-nav>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "yearSelect",
  watch: {
    "$route.hash": function(val) {
      if (!val) return;
      const hashRouteSplit = val.split("#")[1].split("/");
      hashRouteSplit[1]
        ? this.updateSelectedMonth(hashRouteSplit[1])
        : this.updateSelectedMonth("");
      this.updateSelectedYear(hashRouteSplit[0]);
    }
  },
  computed: {
    ...mapState(["selectableYears", "selectedYear"])
  },
  methods: {
    ...mapMutations([
      "updateSelectedYear",
      "updateSelectableYears",
      "updateSelectedMonth"
    ]),
    updateSelectedYearAndRoute(year) {
      this.$router.push({ name: this.$route.name, hash: `#${year}` });
      this.updateSelectedYear(year);
    }
  }
};
</script>