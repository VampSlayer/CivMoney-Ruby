import axios from 'axios'

export default {
    async addTransaction(amount, description, date){
        return await axios.post(`/api/transaction?transaction[amount]=${amount}&transaction[description]=${description}&transaction[date]=${date}`);
    },
    async addMonthlyTransaction(amount, description, year, month){
        return await axios.post(`/api/transactions/addMonthlyFixedTransaction?amount=${amount}&description=${description}&year=${year}&month=${month}`);
    },
}