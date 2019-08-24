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
</style>

<template>
    <div class="container-fluid mt-2">
        <div class="row">
            <div class="col-2">
                <b-card style="background-color: transparent;">
                    <b-card-body><strong>Transaction.</strong> Here you can add a single transaction with a date, either an income or expense.</b-card-body>
                </b-card>
            </div>
            <div class="col-2">
                <b-card style="background-color: transparent;">
                    <b-input :state="amountState" min=0 step="0.01" v-model="amount" type="number" class="mb-1" placeholder="Amount"></b-input>
                    <b-input :state="descriptionState" v-model="description" type="text" class="mt-0 mb-1" placeholder="Description"></b-input>
                    <b-input :state="dateState" v-model="date" type="date" class="mb-1" placeholder="Date"></b-input>
                    <div class="row">
                        <b-form-radio class="ml-3" v-model="selected" name="some-radios" value="income">Income</b-form-radio>
                        <b-form-radio class="ml-2" v-model="selected" name="some-radios" value="expense">Expense</b-form-radio>
                    </div>
                </b-card>
            </div>
            <div class="col-2" :class="{'btn-shake' : shake === true}">
                <b-alert variant="danger" v-if="error">{{error}}</b-alert>
                <b-card title="Add Transaction" v-on:click="addTransaction" style="color: #248df0a1 ;background-color: #00000073;font-size:4.5em;cursor:pointer" class="text-center">
                    <i class="fa fa-plus"></i>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
import transactions from '../services/transactions';
import { mapActions } from "vuex";
import moment from 'moment'
export default {
    name: "AddTransaction",
    data() {
        return {
            amount: 0,
            description: '',
            date: moment(),
            selected: "income",
            error: '',
            shake: false
        };
    },
    computed: {
      amountState() {
        this.shake =false;
        return this.amount > 0;
      },
      dateState() {
        this.shake =false;
        return this.date.length > 0;
      },
      descriptionState() {
        this.shake =false;
        return this.description.length > 0;
      }
    },
    methods:{
        ...mapActions(["getYears"]),
        async addTransaction(){
            this.shake = false;
            if(!this.amountState || !this.descriptionState || !this.dateState){
                this.shake = true;
                return;
            }
            try {
                let amount = this.amount;
                if(this.selected === "expense") amount = -amount;
                await transactions.addTransaction(amount, this.description, this.date);
                await this.getYears();
                this.close();
            } catch (error) {
                this.error = "Cannot add transaction"
            }
        },
        close(){
            this.$emit('closePanel', {})
        }
    }
}
</script>

