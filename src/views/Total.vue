<template>
  <div class="overflow-hidden">
    <div class="mt-2 h-100">
      <view-nav :showYearSelect="false">
        <b-nav-item to="/">
          <i title="Dashboard" class="fas fa-chart-bar"></i>
        </b-nav-item>
      </view-nav>
      <transition name="fade" appear>
        <div class="h-100" key="1">
          <div class="text-center h-100">
            <div class="row">
              <div class="col-11">
                <h2><u>Total {{selectableYears[0]}}-{{selectableYears[selectableYears.length - 1]}}</u></h2>
                <h1 :class="getAmountClass(total)">{{me.currency}}{{ total }}</h1>
              </div>
            </div>
            <div class="row">
                <div class="col">
                  <div style="height: 1em"></div>
                </div>
            </div>
            <div class="row">
              <div class="col" v-for="(amount, index) in allYearsTotals" :key="index">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" :style="{'--size': normalizeValue(amount)}">
                  <circle style="r: var(--size); cx: 50; cy: 50" :class="getAmountClass(amount)"/>
                  <text :x="55 - normalizeValue(amount)" y="50" font-size="0.4em" fill="white">{{me.currency}} {{ amount }}</text>
                </svg>
                <h1>{{selectableYears[index]}}</h1>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ViewNav from "../components/viewnav";

export default {
  name: "Total",
  components: { ViewNav },
  created: function() {
    this.getYears();
  },
  computed: {
    ...mapState(["years", "selectableYears", "me"]),
    allYearsTotals() {
      let allYearsTotals = []
      this.selectableYears.forEach(year => {
        if (this.years[year]) allYearsTotals.push(this.years[year].amount)
      });
      return allYearsTotals
    },
    total() {
      return this.allYearsTotals.reduce((a, b) => a + b, 0).toFixed(2)
    }
  },
  methods: {
    ...mapActions(["getYears"]),
    getAmountClass(value){
      if (value === 0 || value === 0.00) return "orange"
      return value > 0 ? "green" : "red"
    },
    normalizeValue(x) {
      x = Math.abs(x)
      const max = Math.max(...this.allYearsTotals)
      const min = Math.min(...this.allYearsTotals)
      let normalized = (x-min)/(max-min)
      normalized = normalized * 25
      if (isNaN(normalized)) return 0
      return normalized
    },
  }
};
</script>