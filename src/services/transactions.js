import axios from "axios"

export default {
    getTransactionsForDate(date){
        return axios.get(`/api/transactions/date?date=${date}`);
    },
    addTransaction(amount, description, date){
        return axios.post(`/api/transaction?transaction[amount]=${amount}&transaction[description]=${description}&transaction[date]=${date}`);
    },
    addMonthlyTransaction(amount, description, year, month){
        return axios.post(`/api/transactions/addMonthlyFixedTransaction?amount=${amount}&description=${description}&year=${year}&month=${month}`);
    },
    getTransactionsForRange(dateStart, dateEnd){
        return axios.get(`/api/transactions/rangeAll?dateStart=${dateStart}&dateEnd=${dateEnd}`);
    },
    deleteTransction(id){
        return axios.delete(`/api/transactions/delete?id=${id}`);
    },
    seedData(){
        return axios.get("api/seed");
    }
}