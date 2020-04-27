import axios from "axios"

export default {
    async years() {
        return await axios.get("/api/transactions/yearsTotals");
    },
    async getTotalPerMonthForYear(year){
        return await axios.get(`/api/transactions/yearsMonthTotals?year=${year}`);
    },
    async getTotalPerDayForMonth(year, month){
        return await axios.get(`/api/transactions/dailyTotalMonth?year=${year}&month=${month}`);
    },
    async getMonthGroupedTotals(year, month){
        return await axios.get(`/api/transactions/monthGroupedTotals?year=${year}&month=${month}`);
    },
    async getYearGroupedTotals(year){
        return await axios.get(`/api/transactions/yearGroupedTotals?year=${year}`);
    }
}
