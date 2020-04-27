import axios from "axios"

export default {
    async getStatsForYear(year) {
        return await axios.get(`/api/transactions/yearsStats?year=${year}`);
    },
    async getMonthStatsForYear(year) {
        return await axios.get(`/api/transactions/yearMonthStats?year=${year}`);
    },
    async getMonthAvgsForYear(year) {
        return await axios.get(`/api/transactions/yearMonthAvgs?year=${year}`);
    }
}