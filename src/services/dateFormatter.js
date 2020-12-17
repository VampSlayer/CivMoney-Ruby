export default {
    months(month, full) {
        return full ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][month]
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month]
    },

    today(format) {
        return this.format(new Date(), format)
    },

    format(date, format) {
        if(!(date === typeof(Date))) {
            date = new Date(date)
        }
        switch (format) {
            case 'YYYY-MM-DD':
                return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            case 'MMMM, YYYY':
                return `${this.months(date.getMonth(), true)}, ${date.getFullYear()}`
            case 'LL':
                return `${this.months(date.getMonth(), true)} ${date.getDate()}, ${date.getFullYear()}`
            case 'MMMM':
                    return this.months(date.getMonth(), true)
            case 'MM':
                    return date.getMonth() + 1
            default:
                break;
        }
    }
}