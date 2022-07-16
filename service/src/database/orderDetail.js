const connection = require("./startDb")

const orderDetailTable = {
    addOrderDetail: async function(data) {
        const { order_id, product_id, amount } = data
        const query = "INSERT INTO order_detail values (?, ?, ?)"

        await connection.query(query, [order_id, product_id, amount])
    },

    getAllItems: async function(order_id) {
        const query = "SELECT p.*, o.amount FROM product p, (SELECT product_id, amount FROM order_detail od WHERE od.order_id=?) o WHERE p.product_id=o.product_id"
        const [result] = await connection.query(query, order_id)
        return result
    }
}

module.exports = orderDetailTable