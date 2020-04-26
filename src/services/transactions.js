import axios from "axios"

export default {
    async addTransaction(amount, description, date){
        return await axios.post(`/api/transaction?transaction[amount]=${amount}&transaction[description]=${description}&transaction[date]=${date}`);
    },
    async addMonthlyTransaction(amount, description, year, month){
        return await axios.post(`/api/transactions/addMonthlyFixedTransaction?amount=${amount}&description=${description}&year=${year}&month=${month}`);
    },
    async getTransactionsForRange(dateStart, dateEnd){
        return await axios.get(`/api/transactions/rangeAll?dateStart=${dateStart}&dateEnd=${dateEnd}`);
    },
    async deleteTransction(id){
        return await axios.delete(`/api/transactions/delete?id=${id}`);
    },
    async seedData(){
        return await axios.get("api/seed");
    }
}