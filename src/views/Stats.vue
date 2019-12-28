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
            <b-nav-item to="/averages">
              <i title="Averages" class="fas fa-thermometer-empty"></i>
            </b-nav-item>
          </b-nav>
        </div>
        <year-select></year-select>
      </div>
      <div class="h-100">
        <div class="row border-btm" style="height:79%">
            <div class="col-md-6 offset-md-3 h-100">
                <div class="text-center h-100">
                    <pictorialbar :alignLabels="true" :data="selectedYearsStats"></pictorialbar>
                </div>
            </div>
        </div>
        <div class="row h-20">
            <div class="col" v-for="month in monthlyStatsForYear" :key="month.id">
                <pictorialbar :title="month.datemonth" :alignLabels="false" :data="{spent:month.spent, saved:month.saved}"></pictorialbar>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import pictorialbar from '../components/pictoralbar';
import YearSelect from '../components/yearselect';
import statsX from '../services/stats';
import moment from 'moment';

export default {
    name: 'Stats',
    data() {
        return {
            yearlyStats: [],
            monthlyStatsForYear: [], 
            error: null
        }
    },
    components: { pictorialbar, YearSelect },
    created: function() {
        this.getYears();
        this.getYearlyStats();
    },
    watch: {
        selectedYear: async function(){
            this.getMonthStatsForYear();
        }
    },
    computed: {
        ...mapState(["years", "me", "selectedYear"]),
        selectedYearsStats: function(){
            if(this.yearlyStats){
                return this.yearlyStats.find(x => { return x.dateyear === this.selectedYear});
            }
            return {};
        }
    },
    methods: {
        ...mapActions(["getYears"]),
        async getYearlyStats(){
            try {
                const response = await statsX.years();
                this.yearlyStats = response.data;
            } catch (error) {
                this.error = error
            }
        },
        async getMonthStatsForYear(){
            this.$router.push({name: 'stats', hash: `/#${this.selectedYear}`});
            try {
                const result = await statsX.getMonthStatsForYear(this.selectedYear);
                this.monthlyStatsForYear = result.data;
                this.monthlyStatsForYear.forEach(x => {
                    x.id = x.datemonth;
                    x.datemonth = moment().month(x.datemonth - 1).format('MMMM');
                });
            } catch (error) {
                this.error = error
            }
        }
    }
}
</script>