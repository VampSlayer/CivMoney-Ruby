<style>
.white-text{
    color: white;
}
.red {
  color: #ff3333;
  font-weight: bolder;
}
.green {
  color: #00ff7f;
  font-weight: bolder;
}
</style>

<template>
    <div class="container-fluid mt-2">
        <div class="row">
            <div class="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-3">
                <b-alert variant="danger" v-if="error">{{error}}</b-alert>
                <b-card style="background-color: transparent;">
                    <b-card-body>
                        <strong>Search.</strong> Here you can search and manage your transactions, you can delete, filter and sort.
                        <div class="mt-2">
                            <v-date-picker  v-model="range" mode='range' :input-props='{
                        class: "w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 hover:border-blue-5",
                        placeholder: "Please enter dates",
                        readonly: true}'/>
                        </div>
                        <span class="red" v-if="noTransactions">No Transactions in that range.</span>
                        <div class="mt-2" v-if="transactions.length > 0">
                            <b-form-input v-model="filter" type="search" placeholder="Type to filter Transactions"></b-form-input>
                            <b-button title="Clear Filter" class="mt-2" :disabled="!filter" @click="filter = ''"><i class="fa fa-times"></i></b-button>
                        </div>
                    </b-card-body>
                </b-card>
            </div>
            <div class="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-9" v-if="transactions.length > 0">
                 <b-table class="white-text" :items="transactions" head-variant="light" :fields="fields" :filter="filter" :filterIncludedFields="filterOn"
                    v-on:filtered="setFilteredItems($event)">
                     <template v-slot:cell(amount)="data">
                        <span :class="getAmountClass(data.value)">{{data.value}}</span>
                    </template>
                    <!-- <template v-slot:head(delete)="data">
                        <button title="Delete All Transations" class="btn btn-danger" v-on:click="deleteAllTransaction">Delete All</button>
                    </template> -->
                     <template v-slot:cell(delete)="data">
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
import moment from 'moment';
import transactions from "../services/transactions";
export default {
    name: "SearchTransactions",
    data() {
        return {
            fields: [{key: "date", sortable: true} , {key: "amount", sortable: true}, {key: "description", sortable: true}, "delete"],
            error: '',
            range: {
                start: '',
                end: ''
            },
            transactions: [],
            filter: null,
            filterOn: [],
            noTransactions: false,
            filteredItems: []
        }
    },
    watch: {
        range: function(){
            this.getTransactionsForRange();
        }
    },
    methods: {
        getAmountClass(value){
            return value > 0 ? 'green' : 'red'
        },
        deleteTransaction: async function(id){
            if(!id) return;
            try {
                await transactions.deleteTransction(id);
                const transactionToBeDelete = this.transactions.find(x => x.delete === id);
                const indexOfTranasctionToBeDelete = this.transactions.indexOf(transactionToBeDelete)
                this.transactions.splice(indexOfTranasctionToBeDelete, 1);
            } catch (error) {
                 this.error = "Transaction could not be deleted"; 
            }
        },
        deleteAllTransaction: async function(){
            var transactionsToDelete = this.filteredItems.length > 0 ? this.filteredItems : this.transactions;
            console.log(transactionsToDelete)
        },
        getTransactionsForRange: async function(){
            this.noTransactions = false;
            if(!this.range || !this.range.start || !this.range.end) return;
            try {
                const startFormated = moment(this.range.start).format("YYYY-MM-DD");
                const endFormated = moment(this.range.end).format("YYYY-MM-DD");
                const resp = await transactions.getTransactionsForRange(startFormated, endFormated);
                if(resp.data.length === 0) this.noTransactions = true;
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
        setFilteredItems: function(event){
            this.filteredItems = event.filteredItems;
        }
    }
}
</script>