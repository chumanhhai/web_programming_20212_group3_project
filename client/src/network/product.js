const axios = require("axios")

const productAPI = {
    baseUrl: "http://localhost:3000/product",

    getAllProducts: async function(data) {
        const { offset, limit, select, orderBy } = data
        const { data: result } = await axios.get(this.baseUrl + `/allProducts?offset=${offset}\
            &limit=${limit}&select=${select}&orderBy=${orderBy}`)
        return result
    },

    search: async function(title) {
        const { data: result } = await axios.get(this.baseUrl + `/search?title=${title}`)
        return result
    },

    createProduct: async function(product) {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.post(this.baseUrl + "/create", product, {
            headers:{ Authorization: token }
        })
        return result
    },

    updateProduct: async function(update) {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.post(this.baseUrl + "/update", update, {
            headers:{ Authorization: token }
        })
        return result
    },

    deleteProduct: async function(product_id) {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.get(this.baseUrl + `/delete/${product_id}` , {
            headers:{ Authorization: token }
        })
        return result
    },
}

export default productAPI