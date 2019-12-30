import axios from 'axios'

export default {
    async years() {
        return await axios.get('/api/transactions/yearsTotals');
    },
    async getTotalPerMonthForYear(year){
        return await axios.get(`/api/transactions/yearsMonthTotals?year=${year}`);
    },
    async getTotalPerDayForMonth(year, month){
        return await axios.get(`/api/transactions/dailyTotalMonth?year=${year}&month=${month}`);
    },
    async getMonthGroupedToals(year, month){
        return await axios.get(`/api/transactions/monthGroupedToals?year=${year}&month=${month}`);
    },
    async getYearGroupedTotals(year){
        return await axios.get(`/api/transactions/yearGroupedToals?year=${year}`);
    },
    async getTransactionsForDate(date){
        return await axios.get(`/api/transactions/date?date=${date}`);
    },
}
