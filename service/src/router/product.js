const express = require("express")
const productTable = require("../database/product")
const imageTable = require("../database/image")
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/product/allProducts", async (req, res) => {
    try {
        const { offset, limit, select, orderBy } = req.query
        const data = { offset: parseInt(offset), limit: parseInt(limit), select, orderBy }
        const result = await productTable.getAllProducts(data)
        res.status(200).send({ success: { data: result }, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.get("/product/search", async (req, res) => {
    try {
        const { title } = req.query
        const result = await productTable.search(title)
        res.status(200).send({ success: { data: result }, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.get("/product/allProductsOfSupplier/:id", async (req, res) => {
    try {
        const result = await productTable.getAllProductsSupplier(req.params.id)
        res.status(200).send({ success: { data: result }, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.post("/product/create", auth, async (req, res) => {
    try {
        const product = {
            supplier_id: req.params.userId,
            ...req.body
        }
        await productTable.createProduct(product)
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.post("/product/update", auth, async (req, res) => {
    try {
        const [product] = await productTable.getProduct(req.body.product_id)
        if(product && product.supplier_id !== req.params.userId)
            throw new Error({ message: "Authenticate Failed." })

        await productTable.updateProduct(req.body)
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.get("/product/delete/:id", auth, async (req, res) => {
    try {
        const [product] = await productTable.getProduct(req.params.id)
        if(product && product.supplier_id !== req.params.userId)
            throw new Error({ message: "Authenticate Failed." })

        const imagePromise = new Promise(async (resolve) => {
            await imageTable.remove(req.params.id)
            resolve()
        })
        const infoPromise = new Promise(async (resolve) => {
            await productTable.deleteProduct(req.params.id)
            resolve()
        })
        await Promise.all([imagePromise, infoPromise])
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})


module.exports = router