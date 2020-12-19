export default {
    getAmountClass(value) {
        value = Number(value)
        if (!value || value === 0 || value === 0.00) return "orange"
        return value > 0 ? "green" : "red"
    },
    calculateModalSize() {
        let height = window.innerHeight / 2;
        let width = 0

        if (window.innerWidth > 1500) {
            width = window.innerWidth / 3;
        } else {
            width = window.innerWidth - 100;
        } 

        return { height, width };
    }
}