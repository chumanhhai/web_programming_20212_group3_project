const axios = require("axios")

const customerAPI = {
    baseUrl: "http://localhost:3000/customer",

    signUp: async function(customer) {
        const { data: result } = await axios.post(this.baseUrl + "/signUp", customer)
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
    }
}

export default customerAPI