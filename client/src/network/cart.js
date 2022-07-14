const axios = require("axios")

const cartAPI = {
    baseUrl: "http://localhost:3000/cart",

    getCart: async function() {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.get(this.baseUrl + "/getCart", { headers: { Authorization: token } })
        return result
    },

    deleteCart: async function() {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.get(this.baseUrl + "/deleteCart", { headers: { Authorization: token } })
        return result
    },

    addItem: async function(item) {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.post(this.baseUrl + "/addItem", item, { headers: { Authorization: token } })
        return result
    },

    updateItem: async function(item) {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.post(this.baseUrl + "/updateItem", item, { headers: { Authorization: token } })
        return result
    },

    deleteItem: async function(item) {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.post(this.baseUrl + "/removeItem", item, { headers: { Authorization: token } })
        return result
    },
}

export default cartAPI