const axios = require("axios")

const supplierAPI = {
    baseUrl: "http://localhost:3000/supplier",

    signUp: async function(supplier) {
        const { data: result } = await axios.post(this.baseUrl + "/signUp", supplier)
        return result
    },

    logIn: async function(account) {
        const { data: result } = await axios.post(this.baseUrl + "/signIn", account)
        return result
    },

    getMyProfile: async function() {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.get(this.baseUrl + "/me/profile", {
            headers: {
                Authorization: token
            }
        })
        return result
    },

    updateProfile: async function(update) {
        const token = "Bearer " + localStorage.getItem("token")
        const  { data: result } = await axios.post(this.baseUrl + "/updateProfile", update, {
            headers: { Authorization: token }
        })
        return result
    },

    getStatistic: async function() {
        const token = "Bearer " + localStorage.getItem("token")
        const  { data: result } = await axios.get(this.baseUrl + "/statistic", {
            headers: { Authorization: token }
        })
        return result
    }
}

export default supplierAPI