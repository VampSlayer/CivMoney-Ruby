export default {
    getAmountClass(value) {
        value = Number(value)
        if (!value || value === 0 || value === 0.00) return "orange"
        return value > 0 ? "green" : "red"
    },
}