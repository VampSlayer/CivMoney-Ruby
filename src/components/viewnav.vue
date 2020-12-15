<template>
    <div class="row">
        <div class="col-4">
          <b-nav align="left">
            <slot></slot>
          </b-nav>
        </div>
        <year-select v-if="showYearSelect"></year-select>
    </div>
</template>

<script>
import YearSelect from "./yearselect";
export default {
    name: "ViewNav",
    props: {
      showYearSelect: { type: Boolean, default: true }
    },
    components: { YearSelect }
}
</script>