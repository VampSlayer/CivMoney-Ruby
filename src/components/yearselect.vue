<template>
    <div class="col-8">
        <b-nav align="right">
        <b-nav-item
            active-class="year-active"
            v-for="(year, index) in selectableYears"
            :key="index"
            :active="year == selectedYear"
            v-on:click="updateSelectedYear(year)">
            {{ year }}
        </b-nav-item>
        </b-nav>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "YearSelect",
  computed: {
    ...mapState(["selectableYears", "selectedYear"])
  },
  methods: {
    ...mapMutations(['updateSelectedYear', 'updateSelectableYears'])
  }
};
</script>