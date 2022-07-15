const connection = require("./startDb")

const orderTable = {
    createOrder: async function(data) {
        const { order_id, customer_id, ship_address, ship_phone_number, total_cost, createdAt} = data
        const query = "INSERT INTO _order values (?, ?, ?, ?, ?, ?)"

        await connection.query(query, [order_id, customer_id, createdAt, ship_address, ship_phone_number, total_cost])
    },

    getAllOrders: async function(data) {
        const { customer_id, offset, limit } = data
        const query = "SELECT order_id, total_cost, createdAt FROM _order WHERE customer_id=? ORDER BY createdAt DESC LIMIT ?, ? "

        const [ressult] = await connection.query(query, [customer_id, offset, limit])
        return ressult
    }
}

module.exports = orderTable