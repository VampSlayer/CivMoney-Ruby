import axios from "axios";
import store from "../store";
import theme from "./theme";

export default {
    user() {
        return store.state.me;
    },
    check() {
        if (store.state.me) {
            return store.state.me;
        }
        else if (sessionStorage.getItem("me")) {
            store.commit("updateMe", JSON.parse(sessionStorage.getItem("me")));
            return store.state.me;
        } else {
            theme.resetTheme()
        }
    },
    store(me) {
        if(!me) return;
        sessionStorage.setItem("me", JSON.stringify(me));
        theme.setTheme(me.theme);
        store.commit("updateMe", me);
        return store.state.me;
    },
    remove() {
        sessionStorage.removeItem("me");
        theme.resetTheme();
        store.commit("updateMe", null);
    },
    async get() {
        return await axios.get("/api/user/getme");
    },
    async login(id_token) {
        return await axios.post(`/api/login?id_token=${id_token}`);
    },
    async logout() {
        return await axios.post("/api/logout");
    },
    async updateme(me) {
        return await axios.post(`/api/user/updateme?currency=${me.currency}&theme=${me.theme}`);
    }
}
