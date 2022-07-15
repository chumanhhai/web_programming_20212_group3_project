const connection = require("./startDb")

const customerTable = {
    signUp: async function (customer) {
        const { customer_id, name, email, password, address, phone_number } = customer
        const query = "INSERT INTO customer values (?, ?, ?, ?, ?, ?)"
        const [result] = await connection.query(query, [customer_id, name, email, password, address, phone_number])
        if(result.affectedRows == 0)
            throw new Error("Can not sign up customer.")
    },

    signIn: async function(account) {
        const { email, password } = account
        const query = "SELECT customer_id, name, email, address, phone_number FROM customer WHERE email=? AND password=?"

        const [result] = await connection.query(query, [email, password])
        return result
    },

    getMyProfile: async function(customer_id) {
        const query = "SELECT customer_id, name, email, address, phone_number FROM customer WHERE customer_id=?"

        const [result] = await connection.query(query, [customer_id])
        return result
    },

    updateProfile: async function(update) {
        const {customer_id} = update

        delete update.customer_id
        const fields = Object.keys(update)
        const values = Object.values(update)

        let query = "UPDATE customer SET "
        fields.forEach(field => query += `${field}=?,`)
        query = query.substr(0, query.length-1)
        query += " WHERE customer_id=?"

        await connection.query(query, [...values, customer_id])
    }
}

module.exports = customerTable