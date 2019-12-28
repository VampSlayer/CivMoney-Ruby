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
    background: #153057 !important;
    color: #fff !important;
    border: 1px solid #00000073 !important;
}
.card{
    border-radius: 0px !important;
}
.btn-shake {
  animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
}
@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
.cursor{
    cursor: pointer;
}
</style>

<template>
    <div class="container-fluid mt-2" >
        <div class="row">
                    <div class="col-4 col-md-4 col-lg-4 col-xl-2">
                        <b-card style="background-color: transparent;">
                            <b-card-body>
                                <strong>Monthly Income & Expenses.</strong> 
                                Here you can add Incomes and Expenses for any month this year.
                                Simply add something like 'Wages' as an Income and 'Rent' as an Expense.
                                This will then been shown as breakdown visualizations on the dashboard.
                                <strong>Or<b-button :disabled="loading" variant="light" v-on:click="CreateSampleData">Create Sample Transactions</b-button></strong>
                                <div class="text-center mt-2" v-if="loading"><b-spinner label="Spinning"></b-spinner></div>
                                </b-card-body>
                        </b-card>
                        <div class="mt-2" :class="{'btn-shake' : shake === true}">
                         <b-alert variant="danger" v-if="error">{{error}}</b-alert>
                            <b-card title="Add Monthly Income & Expenses" style="color: #248df0a1 ;background-color: #00000073" class="text-center">
                                <multiselect v-model="month" :options="months" placeholder="Select Month" label="name" track-by="value"></multiselect>
                                <a title="Add Monthly Income & Expenses" v-on:click="addMonthlyTransactions" style="cursor:pointer;font-size:4.5em;"><i class="fa fa-plus"></i></a>
                        </b-card>
                        </div>
                    </div>
                    <div class="col-8 col-md-8 col-lg-8 col-xl-10">
                        <div class="row">
                            <div v-for="(transaction, index) in transactions" :key="index" class="col-4 col-md-4 col-lg-4 col-xl-2 mt-2">
                                <b-card style="background-color: transparent;">
                                    <b-input min=0 step="0.01" v-model="transaction.amount" type="number" class="mb-1" placeholder="Amount"></b-input>
                                    <b-input v-model="transaction.description" type="text" class="mt-0 mb-1" placeholder="Description"></b-input>
                                    <div class="row">
                                        <b-form-radio class="ml-3" v-model="transaction.type" :name="'some-radios' + index" value="income">Income</b-form-radio>
                                        <b-form-radio class="ml-2" v-model="transaction.type" :name="'some-radios' + index" value="expense">Expense</b-form-radio>
                                    </div>
                                    <div class="m0">
                                        <a v-if="transactions.length !== 1" v-on:click="removeTransaction(index)" title="Remove transaction" class="float-right cursor"><i class="fa fa-minus"></i></a>
                                    </div>
                                </b-card>
                            </div>
                            <div>
                                <a v-on:click="addTransactionToView" title="Add another" class="float-right cursor"><i class="fa fa-plus"></i></a>
                            </div>
                        </div>
                    </div>
            </div>
    </div>
</template>

<script>
import transactionsService from '../services/transactions';
import { mapActions } from "vuex";
import Multiselect from 'vue-multiselect';
import moment from 'moment';
export default {
    name: 'monthlyTransactions',
    components: { Multiselect },
    data() {
        return {
            months: [{name: 'January', value: '01'}, {name: 'Febuary', value: '02'}, {name: 'March', value: '03'}, {name: 'April', value: '04'}, {name: 'May', value: '05'},
                    {name: 'June', value: '06'}, {name: 'July', value: '07'}, {name: 'August', value: '08'}, {name: 'September', value: '09'}, {name: 'October', value: '10'},
                    {name: 'November', value: '11'}, {name: 'December', value: '12'}],
            transactions: [],
            selected: "income",
            error: '',
            shake: false,
            month: '',
            loading: false
        };
    },
    created: function(){
        this.month = this.months.find(month => {
            if(month.name === moment().format('MMMM')){
                return month;
            }
        }); 
        this.transactions.push({
            amount: 0,
            description: '',
            type: 'income'
        })
    },
    methods: {
        ...mapActions(["getYears"]),
        removeTransaction(index){
            if(this.transactions.length === 1) return;
            this.transactions.splice(index, 1);
        },
        addTransactionToView(){
            this.transactions.push({
                amount: 0,
                description: '',
                type: 'income'
            })
        },
        async addMonthlyTransactions(){
            await this.transactions.forEach(async (transaction) => {
                if(!transaction.amount || transaction.amount <= 0 || !transaction.description){
                    this.shake = true;
                    return;
                }
                try {
                    let amount = transaction.amount;
                    if(transaction.type === "expense") amount = -amount;
                    await transactionsService.addMonthlyTransaction(amount, transaction.description, new Date().getFullYear(), this.month.value);
                    await this.getYears();
                    this.$emit('closePanel', {});
                } catch (error) {
                    this.error = "Cannot add monthly transactions"
                }
            });
        },
        async CreateSampleData(){
            this.loading = false;
            try {
                this.loading = true;
                await transactionsService.seedData();
                await this.getYears();
                this.$emit('closePanel', {})
            } catch (error) {
                this.error = "Cannot add sample data"
            } finally{
                this.loading = false
            }
        }
    }
}
</script>
