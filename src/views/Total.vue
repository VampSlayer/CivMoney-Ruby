<template>
  <div>
    <div class="mt-2 h-100">
      <view-nav :showYearSelect="false">
        <b-nav-item to="/">
          <i title="Dashboard" class="fas fa-chart-bar"></i>
        </b-nav-item>
      </view-nav>
      <div class="h-100">
        <div class="row text-center">
          <transition name="fade" mode="out-in" appear>
            <div v-show="total" class="col">
              <h6 class="total"><u>Total {{ selectableYears[0] }}-{{ selectableYears[selectableYears.length - 1] }}</u></h6>
              <h4 :class="totalClass">{{ me.currency }}{{ total }}</h4>
            </div>
          </transition>
        </div>
        <div class="row h-95">
          <total-bar :data="allYearsTotals"></total-bar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ViewNav from "../components/viewnav";
import TotalBar from "../components/totalbar"
import moment from 'moment';
import utils from '../services/utils'

export default {
  name: "Total",
  components: { ViewNav, TotalBar},
  created: function() {
    this.getYears();
  },
  computed: {
    ...mapState(["years", "selectableYears", "me"]),
    allYearsTotals() {
      let allYearsTotals = []
      this.selectableYears.forEach(year => {
        if (this.years[year]) {
          allYearsTotals.push(
            {
              amount: this.years[year].amount,
              date: moment(`${year}-01-01`).format('L'),
              id: year
            })
        }
      });
      return allYearsTotals
    },
    total() {
      return this.allYearsTotals.map(x => {return x.amount}).reduce((a, b) => a + b, 0).toFixed(2)
    },
    totalClass() {
      return utils.getAmountClass(this.total)
    }
  },
  methods: {
    ...mapActions(["getYears"]),
  }
};
</script>

<style scoped>
  .total { color: var(--cm-input-text-color); }
</style>