const express = require("express")
const supplierTable = require("../database/supplier")
const productTable = require("../database/product")
const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const imageTable = require("../database/image")

const router = express.Router()

router.post("/supplier/signUp", async (req, res) => {
    try {
        const supplierPromise = new Promise(async (resolve) => {
            await supplierTable.signUp(req.body)
            resolve()
        })
        const imagePromise = new Promise(async (resolve) => {
            const data = fs.readFileSync("assets/profile_image.png")
            await imageTable.upload({
                cps_id: req.body.supplier_id,
                data
            })
            resolve()
        })
        await Promise.all([supplierPromise, imagePromise])
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    } 
})

router.post("/supplier/signIn", async (req, res) => {
    try {
        const [supplier] = await supplierTable.signIn(req.body)
        if(supplier) {
            const products = await productTable.getAllProductsSupplier(supplier.supplier_id)
            const token = jwt.sign({ userId: supplier.supplier_id }, process.env.SECRET_JWT_CODE)
            return res.status(200).send({ success: { supplier, products, token }, error: null })
        }
        res.status(200).send({ success: { supplier: null, products: null, token: null}, error: null })

    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.get("/supplier/me/profile", auth, async (req, res) => {
    try {
        const [supplier] = await supplierTable.getMyProfile(req.params.userId)
        if(supplier) {
            const products = await productTable.getAllProductsSupplier(supplier.supplier_id)
            return res.status(200).send({ success: { supplier, products }, error: null })
        }
        res.status(200).send({ success: { supplier: null, products: null}, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.post("/supplier/updateProfile", auth, async (req, res) => {
    try {
        const update = {
            supplier_id: req.params.userId,
            ...req.body
        }
        await supplierTable.updateProfile(update)
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.get("/supplier/statistic", auth, async (req, res) => {
    try {
        const result = await productTable.getAllProductSold(req.params.userId)
        let productsNum = 0
        let income = 0
        result.forEach(product => {
            const amount = parseInt(product.amount)
            const cost = product.cost
            productsNum += amount
            income += amount * cost
        })
        res.status(200).send({ success: { data: { productsNum, income } }, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

module.exports = router