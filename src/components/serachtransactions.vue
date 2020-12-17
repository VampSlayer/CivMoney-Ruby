<template>
    <div class="container-fluid mt-2">
        <div class="row">
            <div class="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-3">
                <b-alert variant="danger" v-if="error">{{error}}</b-alert>
                <b-card>
                    <b-card-body>
                        <h4>Search</h4> Here you can search and manage your transactions, you can delete, filter and sort.
                        <div class="mt-2">
                            <v-date-picker  v-model="range" mode="range" :input-props="inputProps"/>
                        </div>
                        <span class="red" v-if="noTransactions">No Transactions in that range.</span>
                        <div class="mt-2" v-if="transactions.length > 0">
                            <b-form-input v-model="filter" type="search" placeholder="Type to filter Transactions"></b-form-input>
                            <b-button v-if="filteredTransactions.length > 0" title="Delete All Transactions" class="mt-2" variant="danger" v-on:click="deleteTransactions">Delete All Transactions</b-button>
                        </div>
                    </b-card-body>
                </b-card>
            </div>
            <div class="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-9" v-if="transactions.length > 0">
                 <b-table class="search-result-text" :items="transactions" head-variant="light" :fields="fields" :filter="filter" :filterIncludedFields="[]" v-on:filtered="setFilteredTransactions">
                     <template slot="amount" slot-scope="data">
                        <span :class="getAmountClass(data.value)">{{data.value}}</span>
                    </template>
                     <template slot="delete" slot-scope="data">
                        <button title="Delete Transaction" class="btn btn-danger" v-on:click="deleteTransaction(data.value)">
                            <i class="fa fa-times"></i>
                        </button>
                    </template>
                 </b-table>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import transactions from "../services/transactions";
import { mapActions } from "vuex";
import utils from "../services/utils"

export default {
    name: "SearchTransactions",
    data() {
        return {
            fields: [{key: "date", sortable: true} , {key: "amount", sortable: true}, {key: "description", sortable: true}, "delete"],
            error: "",
            range: {
                start: "",
                end: ""
            },
            transactions: [],
            filter: null,
            noTransactions: false,
            filteredTransactions: [],
            deletionOccured: false,
            inputProps: {
                class: "w-full w-100 shadow appearance-none border rounded py-2 px-3 text-gray-700 hover:border-blue-5",
                placeholder: "Please enter dates",
                readonly: true
            }
        }
    },
    destroyed: async function(){
        if (this.deletionOccured) {
            await this.getYears()
        }
    },
    watch: {
        range: function(){
            this.getTransactionsForRange();
        }
    },
    methods: {
        ...mapActions(["getYears"]),
        getAmountClass(value){
           return utils.getAmountClass(value)
        },
        deleteTransaction: async function(id){
            if(!id) return;
            try {
                await transactions.deleteTransction(id);
                const transactionToBeDelete = this.transactions.find(x => x.delete === id);
                const indexOfTranasctionToBeDelete = this.transactions.indexOf(transactionToBeDelete)
                this.transactions.splice(indexOfTranasctionToBeDelete, 1);
                this.deletionOccured = true;
            } catch (error) {
                 this.error = "Transaction could not be deleted"; 
            }
        },
        deleteTransactions: async function() {
            this.filteredTransactions.forEach(async (transaction) => {
                await this.deleteTransaction(transaction.delete)
            });
        },
        getTransactionsForRange: async function(){
            this.noTransactions = false;
            if(!this.range || !this.range.start || !this.range.end) return;
            try {
                const startFormated = moment(this.range.start).format("YYYY-MM-DD");
                const endFormated = moment(this.range.end).format("YYYY-MM-DD");
                const resp = await transactions.getTransactionsForRange(startFormated, endFormated);
                if(resp.data.length === 0) this.noTransactions = true;
                // TODO: move to back end
                this.transactions = resp.data.map(x => ({
                    delete: x.id,
                    amount: x.amount,
                    description: x.description,
                    date: moment(x.date).format("LL")
                }))
            } catch (error) {
                this.error = error;  
            }
        },
        setFilteredTransactions: function(transactionsToBeSet){
            this.filteredTransactions = transactionsToBeSet;
        }
    }
}
</script>