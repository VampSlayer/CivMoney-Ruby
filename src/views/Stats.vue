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
        <div class="row border-btm" style="height:79%">
            <div class="col-md-6 offset-md-3 h-100">
                <div class="text-center h-100">
                    <pictorialbar :alignLabels="true" :data="selectedYearsStats"></pictorialbar>
                </div>
            </div>
        </div>
        <div class="row h-20">
            <div class="col">
                <pictorialbar title="January" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
            <div class="col">
                <pictorialbar title="Febuary" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
            <div class="col">
                <pictorialbar title="March" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
            <div class="col">
                <pictorialbar title="April" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
            <div class="col">
                <pictorialbar title="May" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
            <div class="col">
                <pictorialbar title="June" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
            <div class="col">
                <pictorialbar title="July" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
            <div class="col">
                <pictorialbar title="August" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
            <div class="col">
                <pictorialbar title="September" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
            <div class="col">
                <pictorialbar title="October" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
            <div class="col">
                <pictorialbar title="November" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
            <div class="col">
                <pictorialbar title="December" :alignLabels="false" :data="{spent:50, saved:50}"></pictorialbar>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import pictorialbar from '../components/pictoralbar';
import statsX from '../services/stats';
export default {
    name: 'Stats',
    data() {
        return {
            selectedYear: '',
            yearlyStats: null,
            montlyStatsForYear: null
        }
    },
    components: { pictorialbar },
    created: function() {
        this.getYears();
        this.getYearlyStats();
    },
    watch: {
        selectableYears: function() {
            if (this.selectableYears && this.selectableYears.length > 0) {
                this.selectedYear = Math.max(this.selectableYears);
            }
        },
        selectedYear: function(){
            try {
                this.montlyStatsForYear = statsX.getMonthStatsForYear(this.selectedYear);
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
        ...mapActions(["getYears"]),
        async getYearlyStats(){
            try {
                const response = await statsX.years();
                this.yearlyStats = response.data;
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>