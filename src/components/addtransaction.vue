<template>
    <div class="container-fluid mt-2">
        <div class="row">
            <div class="col-4 col-md-4 col-lg-4 col-xl-3">
                <b-card>
                    <b-card-body>
                        <h4>Transaction</h4>
                        Here you can add a single transaction with a date, either an income or expense. Fill in the details of the transaction then click the <strong>+</strong> button to add.
                    </b-card-body>
                </b-card>
            </div>
            <div class="col-4 col-md-4 col-lg-4 col-xl-3" :class="{'btn-shake' : shake === true}">
                <b-alert variant="danger" v-if="error">{{error}}</b-alert>
                <b-card>
                    <b-input :state="amountState" min=0 step="0.01" v-model="amount" type="number" class="mb-1" placeholder="Amount"></b-input>
                    <b-input :state="descriptionState" v-model="description" type="text" class="mt-0 mb-1" placeholder="Description"></b-input>
                    <b-input :state="dateState" v-model="date" type="date" class="mb-1" placeholder="Date"></b-input>
                    <div class="row">
                        <div class="col-10">
                            <switches v-model="income" text-enabled="Income" text-disabled="Expense" color="blue" theme="custom"></switches>
                        </div>
                        <div class="col-2 pt-44">
                        <button class="float-right add-st-btn" title="Add Transaction" v-on:click="addTransaction" > <i class="fa fa-plus"></i></button>
                        </div>
                    </div>
                </b-card>
            </div>
        </div>
    </div>
</template>

<script>
import transactions from "../services/transactions";
import { mapActions } from "vuex";
import moment from "moment"
import Switches from "vue-switches";
export default {
    name: "AddTransaction",
    components: { Switches },
    data() {
        return {
            amount: 0,
            description: "",
            date: moment().format('YYYY-MM-DD'),
            income: true,
            error: "",
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
                if(this.income === false) amount = -amount;
                await transactions.addTransaction(amount, this.description, this.date);
                await this.getYears();
                this.close();
            } catch (error) {
                this.error = "Cannot add transaction"
            }
        },
        close(){
            this.$emit("closePanel", {})
        }
    }
}
</script>

