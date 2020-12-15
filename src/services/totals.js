import axios from "axios"

export default {
    years() {
        return axios.get("/api/transactions/yearsTotals");
    },
    getTotalPerMonthForYear(year){
        return axios.get(`/api/transactions/yearsMonthTotals?year=${year}`);
    },
    getTotalPerDayForMonth(year, month){
        return axios.get(`/api/transactions/dailyTotalMonth?year=${year}&month=${month}`);
    },
    getMonthGroupedTotals(year, month){
        return axios.get(`/api/transactions/monthGroupedTotals?year=${year}&month=${month}`);
    },
    getYearGroupedTotals(year){
        return axios.get(`/api/transactions/yearGroupedTotals?year=${year}`);
    }
}
