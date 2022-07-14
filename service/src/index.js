const express = require("express")
const cors = require("cors")
require("./database/startDb")
const productRouter = require("./router/product")
const customerRouter = require("./router/customer")
const cartRouter = require("./router/cart")
const orderRouter = require("./router/order")
const imageRouter = require("./router/image")
const supplierRouter = require("./router/supplier")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(productRouter)
app.use(customerRouter)
app.use(cartRouter)
app.use(orderRouter)
app.use(imageRouter)
app.use(supplierRouter)

app.listen(PORT, () => console.log("Server is up on port", PORT))