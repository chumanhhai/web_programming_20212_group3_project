const axios = require("axios")

const orderAPI = {
    baseUrl: "http://localhost:3000/order",

    createOrder: async function(order) {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.post(this.baseUrl + "/createOrder", order, { headers: { Authorization: token } })
        return result
    },

    getAllOrders: async function(data) {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.post(this.baseUrl + "/getAllOrders", data, { headers: { Authorization: token } })
        return result
    },

    getAllItems: async function(data) {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.post(this.baseUrl + "/getAllItems", data, { headers: { Authorization: token } })
        return result
    }
}

export default orderAPI