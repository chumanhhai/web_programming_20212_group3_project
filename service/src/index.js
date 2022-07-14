const express = require("express")
const cors = require("cors")
require("./database/startDb")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.listen(PORT, () => console.log("Server is up on port", PORT))