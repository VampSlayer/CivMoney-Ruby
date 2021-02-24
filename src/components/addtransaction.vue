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
                <b-card :class="income ? 'green-background': 'red-background'">
                    <b-input :state="amountState" min=0 step="0.01" v-model="amount" type="number" class="mb-1" @keyup.enter="addTransaction"></b-input>
                    <b-form-select class="form-control mb-1" v-model="topDescription" :options="topDescriptions">
                        <template #first>
                            <option value="null" selected>New Description</option>
                        </template>
                    </b-form-select>
                    <b-input :disabled="topDescriptionState" :state="descriptionState" v-model="description" type="text" class="mt-0 mb-1" placeholder="New Description" @keyup.enter="addTransaction"></b-input>
                    <v-date-picker v-model="date"/>
                    <div class="row">
                        <div class="col-10">
                            <toggle onText="Income" offText="Expense" v-on:toggle="setIncomeOrExpense"></toggle>
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
import { mapActions, mapState } from "vuex";
import Toggle from "./toggle"

export default {
    name: "AddTransaction",
    components: { Toggle },
    data() {
        return {
            amount: 0,
            description: null,
            topDescription: null,
            date: new Date(),
            income: true,
            error: "",
            shake: false
        };
    },
    computed: {
      ...mapState(["topDescriptions"]),
      amountState() {
        this.shake = false;
        return this.amount > 0;
      },
      descriptionState() {
        this.shake = false;
        return (this.description && this.description.length > 0) || (this.topDescription && this.topDescription.length > 0 && this.topDescription !== "null");
      },
      topDescriptionState() {
        return this.topDescription !== null && this.topDescription !== "null"
      }
    },
    watch: {
        topDescription() {
            this.description = null
        }
    },
    methods:{
        ...mapActions(["getYears"]),
        async addTransaction(){
            this.shake = false;
            if(!this.amountState || !this.descriptionState){
                this.shake = true;
                return;
            }
            let description = this.description ? this.description : this.topDescription
            try {
                let amount = this.amount;
                if(this.income === false) amount = -amount;
                await transactions.addTransaction(amount, description, this.date);
                await this.getYears();
                this.close();
            } catch (error) {
                this.error = "Cannot add transaction"
            }
        },
        close(){
            this.$emit("closePanel", {})
        },
        setIncomeOrExpense(status) {
            this.income = status
        }
    }
}
</script>

