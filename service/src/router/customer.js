const express = require("express")
const customerTable = require("../database/customer")
const cartTable = require("../database/cart")
const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken")
const imageTable = require("../database/image")
const fs = require("fs")

const router = express.Router()

router.post("/customer/signUp", async (req, res) => {
    try {
        const customerPromise = new Promise(async (resolve) => {
            await customerTable.signUp(req.body)
            resolve()
        })
        const imagePromise = new Promise(async (resolve) => {
            const data = fs.readFileSync("assets/profile_image.png")
            await imageTable.upload({
                cps_id: req.body.customer_id,
                data
            })
            resolve()
        })
        await Promise.all([customerPromise, imagePromise])
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    } 
})

router.post("/customer/signIn", async (req, res) => {
    try {
        const [customer] = await customerTable.signIn(req.body)
        if(customer) {
            const cart = await cartTable.getCart(customer.customer_id)
            const token = jwt.sign({ userId: customer.customer_id }, process.env.SECRET_JWT_CODE)
            return res.status(200).send({ success: { customer, cart, token }, error: null })
        }
        res.status(200).send({ success: { data: null, token: "" }, error: null })

    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.get("/customer/me/profile", auth, async (req, res) => {
    try {
        const [customer] = await customerTable.getMyProfile(req.params.userId)
        const cart = await cartTable.getCart(customer.customer_id)
        res.status(200).send({ success: { customer, cart }, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.post("/customer/updateProfile", auth, async (req, res) => {
    try {
        const update = {
            customer_id: req.params.userId,
            ...req.body
        }
        await customerTable.updateProfile(update)
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

module.exports = router