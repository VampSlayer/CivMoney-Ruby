<style>
.btn-transaction-type{
border: 1px solid #153057 !important;
border-radius: 0px !important;
}
.active{
border: 1px solid #153057 !important;
border-radius: 0px !important;
}
.custom-control-input:checked ~ .custom-control-label::before {
    color: #fff;
    border-color: #153057 !important;
    background-color: #153057 !important;
}
.form-control{
    border-radius: 0px !important;
}
.card{
    border-radius: 0px !important;
}
</style>

<template>
    <div class="container-fluid mt-2">
        <div class="row">
            <div class="col-2">
                <b-card style="background-color: transparent;">
                    <b-input :state="false" type="number" re class="mb-1" placeholder="Amount"></b-input>
                    <b-input type="text" class="mb-1" placeholder="Description"></b-input>
                    <b-input type="date" class="mb-1" placeholder="Date"></b-input>
                    <div class="row">
                        <b-form-radio style="color:green!important" class="ml-3" v-model="selected" name="some-radios" value="income">Income</b-form-radio>
                        <b-form-radio style="color:red!important" class="ml-2" v-model="selected" name="some-radios" value="expense">Expense</b-form-radio>
                    </div>
                </b-card>
            </div>
            <div class="col-2">
                <b-card title="Add Transaction" v-on:click="close" style="color: #248df0a1 ;background-color: #00000073;font-size:4.5em;cursor:pointer" class="text-center">
                    <i class="fa fa-plus"></i>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AddTransaction",
    data() {
        return {
            expense: false,
            income: false,
            selected: "income"
        };
    },
    methods:{
        close(){
            this.$emit('closePanel', {})
        }
    }
}
</script>

