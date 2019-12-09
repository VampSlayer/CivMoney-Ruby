<style scoped>
.border-btm {
    border-bottom: 1px solid rgba(204, 204, 204, 0.933);
}
</style>

<template>
    <div>
    <div class="mt-2 h-100">
      <div class="row">
        <div class="col-4">
          <b-nav align="left">
            <b-nav-item to="/">
              <i title="Dashboard" class="fas fa-chart-bar"></i>
            </b-nav-item>
            <b-nav-item to="/stats">
              <i title="Statistics" class="fa fa-percent"></i>
            </b-nav-item>
          </b-nav>
        </div>
        <div class="col-8">
          <b-nav align="right">
            <b-nav-item
              active-class="year-active"
              v-for="(year, index) in sortedYears"
              :key="index"
              :active="year === selectedYear"
              v-on:click="selectedYear = year;"
            >{{ year }}</b-nav-item>
          </b-nav>
        </div>
      </div>
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
import multiLine from '../components/multiLine';
import statsX from '../services/stats';
import moment from 'moment';

export default {
    name: 'Averages',
    data() {
        return {
            selectedYear: '',
            yearlyStats: [],
            monthlyAvgsForYear: []
        }
    },
    components: { multiLine },
    created: function() {
        this.getYears();
    },
    watch: {
        selectableYears: function() {
            if (this.selectableYears && this.selectableYears.length > 0) {
                this.selectedYear = Math.max(this.selectableYears);
            }
        },
        selectedYear: async function(){
            try {
                const result = await statsX.getMonthAvgsForYear(this.selectedYear);
                this.monthlyAvgsForYear = result.data;
                this.monthlyAvgsForYear.forEach(x => {
                    x.id = x.datemonth;
                    x.datemonth = `${this.selectedYear}-${x.datemonth}-01`
                });
            } catch (error) {
                console.log(error)
            }
        }
    },
    computed: {
        ...mapState(["years", "me", "selectableYears"]),
        sortedYears: function(){
            return this.selectableYears.sort((a, b) => {return a - b});
        },
        selectedYearsStats: function(){
            if(this.yearlyStats){
                return this.yearlyStats.find(x => { return x.dateyear === this.selectedYear});
            }
            return {};
        }
    },
    methods: {
        ...mapActions(["getYears"])
    }
}
</script>