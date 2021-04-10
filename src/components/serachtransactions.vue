<template>
    <div class="container-fluid mt-2">
        <div class="row">
            <div class="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-3 position-fixed">
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
                            <b-button v-if="filteredTransactions.length > 0" title="Delete All Transactions" class="mt-2 btn-delete" variant="danger" v-on:click="deleteTransactions">Delete All Transactions</b-button>
                        </div>
                    </b-card-body>
                </b-card>
            </div>
            <div class="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-3" style="z-index:-1;">
            </div>
            <div class="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-9 offset" v-if="transactions.length > 0">
                 <b-table class="search-result-text" :items="transactions" :fields="fields" :filter="filter" :filterIncludedFields="[]" v-on:filtered="setFilteredTransactions">
                     <template slot="amount" slot-scope="data">
                        <span>{{data.value}}</span>
                    </template>
                     <template slot="delete" slot-scope="data">
                        <button title="Delete Transaction" class="btn btn-danger btn-delete" v-on:click="deleteTransaction(data.value)">
                            <i class="mi mi-Delete"></i>
                        </button>
                    </template>
                 </b-table>
            </div>
        </div>
    </div>
</template>

<script>
import transactions from "../services/transactions";
import { mapActions } from "vuex";
import utils from "../services/utils"
import dateFormatter from '../services/dateFormatter'

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
                const startFormated = dateFormatter.format(this.range.start, "YYYY-MM-DD");
                const endFormated = dateFormatter.format(this.range.end, "YYYY-MM-DD");
                const resp = await transactions.getTransactionsForRange(startFormated, endFormated);
                if(resp.data.length === 0) this.noTransactions = true;
                this.transactions = resp.data
            } catch (error) {
                // eslint-disable-next-line
                console.error(error)
                this.error = error;  
            }
        },
        setFilteredTransactions: function(transactionsToBeSet){
            this.filteredTransactions = transactionsToBeSet;
        }
    }
}
</script>