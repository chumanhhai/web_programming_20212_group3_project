const axios = require("axios")

const imageAPI = {
    baseURL: "http://localhost:3000/image",

    uploadAvatar: async function(data) {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.post(this.baseURL + "/avatarUpload", data, {
            headers: { Authorization: token }
        })
        return result
    },

    uploadProduct: async function(data) {
        const token = "Bearer " + localStorage.getItem("token")
        const { data: result } = await axios.post(this.baseURL + "/productUpload", data, {
            headers: { Authorization: token }
        })
        return result
    },
}

export default imageAPI