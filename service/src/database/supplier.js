const connection = require("./startDb")

const supplierTable = {
    signUp: async function (supplier) {
        const { supplier_id, name, email, password, address, phone_number } = supplier
        const query = "INSERT INTO supplier values (?, ?, ?, ?, ?, ?)"
        const [result] = await connection.query(query, [supplier_id, name, email, password, address, phone_number])
        if(result.affectedRows == 0)
            throw new Error("Can not sign up supplier.")
    },

    signIn: async function(account) {
        const { email, password } = account
        const query = "SELECT supplier_id, name, email, address, phone_number FROM supplier WHERE email=? AND password=?"

        const [result] = await connection.query(query, [email, password])
        return result
    },

    getMyProfile: async function(supplier_id) {
        const query = "SELECT supplier_id, name, email, address, phone_number FROM supplier WHERE supplier_id=?"

        const [result] = await connection.query(query, [supplier_id])
        return result
    },

    updateProfile: async function(update) {
        const {supplier_id} = update

        delete update.supplier_id
        const fields = Object.keys(update)
        const values = Object.values(update)

        let query = "UPDATE supplier SET "
        fields.forEach(field => query += `${field}=?,`)
        query = query.substr(0, query.length-1)
        query += " WHERE supplier_id=?"

        await connection.query(query, [...values, supplier_id])
    }
}

module.exports = supplierTable