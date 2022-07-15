const express = require("express")
const cartTable = require("../database/cart")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/cart/addItem", auth, async (req, res) => {
    try {
        const data = {
            ...req.body,
            customer_id: req.params.userId
        }
        await cartTable.addItem(data)
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.post("/cart/removeItem", auth, async (req, res) => {
    try {
        const data = {
            ...req.body,
            customer_id: req.params.userId
        }
        await cartTable.removeItem(data)
        res.status(200).send({ success: true, error: null })
    } catch(e) {    
        res.status(200).send({ success: null, error: e })
    }
})

router.post("/cart/updateItem", auth, async (req, res) => {
    try {
        const data = {
            ...req.body,
            customer_id: req.params.userId
        }
        await cartTable.updateItem(data)
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.get("/cart/getCart", auth, async(req, res) => {
    try {
        const result = await cartTable.getCart(req.params.userId)
        res.status(200).send({ success: { data: result }, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.get("/cart/deleteCart", auth, async(req, res) => {
    try {
        await cartTable.deleteCart(req.params.userId)
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

module.exports = router