<template>
    <div class="row">
        <div class="col-4">
          <b-nav align="left">
            <slot></slot>
          </b-nav>
        </div>
        <year-select></year-select>
    </div>
</template>

<script>
import YearSelect from './yearselect';
export default {
    name: "ViewNav",
    components: { YearSelect }
}
</script>