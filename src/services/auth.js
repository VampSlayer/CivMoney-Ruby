import store from '@/store';
import axios from 'axios'

export default {
    user() {
        return store.state.me;
    },
    check() {
        if (store.state.me) {
            return store.state.me;
        }
        else if (sessionStorage.getItem('me')) {
            store.commit('updateMe', JSON.parse(sessionStorage.getItem('me')));
            return store.state.me;
        }
    },
    store(me) {
        if(!me) return;
        sessionStorage.setItem('me', JSON.stringify(me));
        store.commit('updateMe', me);
        return store.state.me;
    },
    remove() {
        sessionStorage.removeItem('me');
        store.commit('updateMe', null);
    },
    async get() {
        return await axios.get('/api/user/getme');
    },
    async login(data) {
        return await axios.post('/api/login', data);
    },
    async logout() {
        return await axios.post('/api/logout');
    }
}
