const connection = require("../database/startDb")

const productTable = {
    getAllProducts: async function(data) {
        const { offset, limit, select, orderBy } = data

        let orderQuery
        switch(orderBy) {
            case "new": {
                orderQuery = "createdAt DESC"
                break;
            }
            case "lowCost": {
                orderQuery = "cost ASC"
                break
            }
            case "highCost": {
                orderQuery = "cost DESC"
                break
            }
            default: throw new Error({ message: "'order by' query is invalid." })
        }

        let selectQuery = true
        if(select !== "all") selectQuery = "p.category='" + select +"'"

        const query = `SELECT p.*, s.name supplier_name
            FROM product p, supplier s 
            WHERE p.supplier_id=s.supplier_id AND ${selectQuery}
            ORDER BY ${orderQuery}
            LIMIT ?, ?`

        const [result] = await connection.query(query, [offset, limit])
        return result
    },

    search: async function(title) {
        const query = `SELECT p.*, s.name supplier_name
            FROM product p, supplier s 
            WHERE p.supplier_id=s.supplier_id AND LOWER(p.name) LIKE "%${title}%"`
        
            const [result] = await connection.query(query)
            return result
    },

    getAllProductsSupplier: async function(supplier_id) {
        const query = `SELECT * FROM product WHERE supplier_id=? ORDER BY createdAt DESC`

        const [result] = await connection.query(query, supplier_id)
        return result
    },

    getAllProductSold: async function(supplier_id) {
        const query = `SELECT sum(od.amount) amount, p.cost 
            FROM order_detail od, (SELECT product_id, cost FROM product WHERE supplier_id=?) p
            WHERE od.product_id=p.product_id
            GROUP BY p.product_id`

        const [result] = await connection.query(query, supplier_id)
        return result
    },

    createProduct: async function(product) {
        const { product_id, supplier_id, name, cost, createdAt, category,
            short_description, full_description } = product
        const query = `INSERT INTO product VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        
        await connection.query(query, [product_id, name, category, short_description,
            full_description, supplier_id, cost, createdAt])
    },

    updateProduct: async function(update) {
        const {product_id} = update

        delete update.product_id
        const fields = Object.keys(update)
        const values = Object.values(update)

        let query = "UPDATE product SET "
        fields.forEach(field => query += `${field}=?,`)
        query = query.substr(0, query.length-1)
        query += " WHERE product_id=?"

        await connection.query(query, [...values, product_id])
    },

    deleteProduct: async function(product_id) {
        const query = "DELETE FROM product WHERE product_id=?"

        await connection.query(query, [product_id])
    },

    getProduct: async function(product_id) {
        const query = "SELECT * FROM product WHERE product_id=?"

        const [result] = await connection.query(query, product_id)
        return result
    }

}

module.exports = productTable