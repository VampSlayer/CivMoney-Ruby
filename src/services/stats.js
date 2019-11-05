import axios from 'axios'

export default {
    async years() {
        debugger
        return await axios.get('/api/transactions/yearsStats');
    },
}