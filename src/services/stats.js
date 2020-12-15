import axios from "axios"

export default {
    getStatsForYear(year) {
        return axios.get(`/api/transactions/yearsStats?year=${year}`);
    },
    getMonthStatsForYear(year) {
        return axios.get(`/api/transactions/yearMonthStats?year=${year}`);
    },
    getMonthAvgsForYear(year) {
        return axios.get(`/api/transactions/yearMonthAvgs?year=${year}`);
    }
}