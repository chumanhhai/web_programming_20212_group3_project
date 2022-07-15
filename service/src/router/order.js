const express = require("express")
const orderTable = require("../database/order")
const orderDetailTable = require("../database/orderDetail")
const cartTable = require("../database/cart")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/order/createOrder", auth, async (req, res) => {
    try {
        const { items, order_id, ship_address, ship_phone_number, total_cost, createdAt } = req.body
        const order = { order_id, ship_address, ship_phone_number, total_cost, createdAt, customer_id: req.params.userId }

        let promises = []
        await orderTable.createOrder(order)

        for(let i = 0; i < items.length; i++) { // add order detail
            const { product_id, amount } = items[i]
            promises.push(new Promise(async (resolve) => {
                await orderDetailTable.addOrderDetail({ order_id, product_id, amount })
                resolve()
            }))
        }

        promises.push(new Promise(async (resolve) => {
            await cartTable.deleteCart(req.params.userId)
            resolve()
        }))

        await Promise.all(promises) // run task asynchronously

        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.post("/order/getAllOrders", auth, async (req, res) => {
    try {
        const data = {
            ...req.body,
            customer_id: req.params.userId
        }
        const result = await orderTable.getAllOrders(data)
        res.status(200).send({ success: { data: result }, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }

})

router.post("/order/getAllItems", auth, async (req, res) => {
    try {
        const { order_id } = req.body
        const result = await orderDetailTable.getAllItems(order_id)
        res.status(200).send({ success: { data: result }, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

module.exports = router