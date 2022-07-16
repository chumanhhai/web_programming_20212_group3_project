const connection = require("./startDb")

const cartTable = {
    addItem: async function(data) {
        const { customer_id, product_id, amount } = data
        const query = "INSERT INTO cart_detail values (?, ?, ?)"

        await connection.query(query, [customer_id, product_id, amount])
    },

    removeItem: async function(data) {
         const { customer_id, product_id } = data
         const query = "DELETE FROM cart_detail WHERE customer_id=? AND product_id=?"

         await connection.query(query, [customer_id, product_id])
    },

    updateItem: async function(data) {
        const { customer_id, product_id, amount } = data
        const query = "UPDATE cart_detail SET amount=? WHERE customer_id=? AND product_id=?"

        await connection.query(query, [amount, customer_id, product_id])
    },

    getCart: async function(customer_id) {
        const query = "SELECT p.*, c.amount FROM product p, (SELECT * FROM cart_detail WHERE customer_id=?) c WHERE p.product_id=c.product_id"

        const [result] = await connection.query(query, customer_id)
        return result
    },

    deleteCart: async function(customer_id) {
        const query = "DELETE FROM cart_detail WHERE customer_id=?"

        await connection.query(query, [customer_id])
    }
}

module.exports = cartTable