import store from "../store"

export default {
    setTheme(theme){
        if (localStorage.getItem("cm--selected-theme") !== theme){
            localStorage.setItem("cm--selected-theme", theme);
            document.documentElement.setAttribute("data-theme", theme);
            this.setWindowCivMoney();
        }

        if (!theme) this.setTheme("dark");
    },
    resetTheme(){
        document.documentElement.setAttribute("data-theme", "dark");
        this.setWindowCivMoney();
        localStorage.removeItem("cm--selected-theme");
    },
    setWindowCivMoney(){
        const style = getComputedStyle(document.body);
        const theme = {
            name: style.getPropertyValue("--cm-theme-name"),
            background: style.getPropertyValue("--cm-background"),
            text: style.getPropertyValue("--cm-text-color"),
            chartText: style.getPropertyValue("--cm-chart-text-color"),
            red: style.getPropertyValue("--cm-red"),
            green: style.getPropertyValue("--cm-green"),
            orange: style.getPropertyValue("--cm-orange"),
            nav: style.getPropertyValue("--cm-nav-color"),
            yearLine: style.getPropertyValue("--cm-year-line-color"),
            themes: JSON.parse(style.getPropertyValue("--cm-themes")),
            luminosity: Number(style.getPropertyValue("--cm-luminosity")),
            logo: Number(style.getPropertyValue("--cm-logo"))
        }
        store.commit("updateTheme", theme);
    },
    setThemeOnLoad(){
        if (localStorage.getItem("cm--selected-theme")) document.documentElement.setAttribute("data-theme", localStorage.getItem("cm--selected-theme"));
    },
    use(){
        this.setThemeOnLoad();
        this.setWindowCivMoney();
    }
}
