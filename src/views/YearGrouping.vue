<style scoped>
.border-btm {
    border-bottom: 1px solid rgba(204, 204, 204, 0.933);
}
</style>

<template>
    <div>
    <div class="mt-2 h-100">
      <lower-nav>
        <b-nav-item to="/">
            <i title="Dashboard" class="fas fa-chart-bar"></i>
        </b-nav-item>
        <b-nav-item to="/stats">
            <i title="Statistics" class="fa fa-percent"></i>
        </b-nav-item>
        <b-nav-item to="/averages">
            <i title="Averages" class="fas fa-thermometer-empty"></i>
        </b-nav-item>
      </lower-nav>
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
import LowerNav from '../components/lowernav';
import Total from '../services/totals';
import TreeMap from '../components/treemap'

export default {
    name: 'YearGrouping',
    data() {
        return {
            yearGroupedIncomes: [],
            yearGroupedExpenses: [],
            error: null
        }
    },
    components: { LowerNav, TreeMap },
    created: function() {
        this.getYears();
    },
    watch: {
        selectedYear: async function(){
            this.$router.push({name: 'year', hash: `/#${this.selectedYear}`});
            try {
                const result = await Total.getYearGroupedTotals(this.selectedYear);
                let incomes = []
                let expenses = []
                result.data.forEach(x => {
                    if(x.amount > 0 ) incomes.push(x)
                    if(x.amount < 0 ) expenses.push(x)
                });
                this.yearGroupedIncomes = incomes.map(x => {
                    return {
                        name: x.description,
                        children: [
                            {
                                "name": x.description,
                                "value": x.amount
                            }
                        ]
                    }
                });
                this.yearGroupedExpenses = expenses.map(x => {
                    return {
                        name: x.description,
                        children: [
                            {
                                "name": x.description,
                                "value": Math.abs(x.amount)
                            }
                        ]
                    }
                });
            } catch (error) {
                this.error = error;
            }
        }
    },
    computed: {
        ...mapState(["years", "me", "selectedYear"])
    },
    methods: {
        ...mapActions(["getYears"])
    }
}
</script>