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
        <year-select></year-select>
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
import YearSelect from '../components/yearselect';
import statsX from '../services/stats';

export default {
    name: 'Averages',
    data() {
        return {
            yearlyStats: [],
            monthlyAvgsForYear: [],
            error: null
        }
    },
    components: { multiLine, YearSelect },
    created: function() {
        this.getYears();
    },
    watch: {
        selectedYear: async function(){
            this.$router.push({name: 'averages', hash: `/#${this.selectedYear}`});
            try {
                const result = await statsX.getMonthAvgsForYear(this.selectedYear);
                this.monthlyAvgsForYear = result.data;
                this.monthlyAvgsForYear.forEach(x => {
                    x.id = x.datemonth;
                    x.datemonth = `${this.selectedYear}-${x.datemonth}-01`
                });
            } catch (error) {
                this.error = error;
            }
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
        ...mapActions(["getYears"])
    }
}
</script>