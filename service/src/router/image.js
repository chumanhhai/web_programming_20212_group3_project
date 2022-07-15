const express = require("express")
const multer = require("multer")
const auth = require("../middleware/auth")
const imageTable = require("../database/image")

const router = express.Router()

const upload = multer({
    limits: {
        fileSize: 1000000
    }
})

router.post("/image/avatarUpload", auth, upload.single("image"), async (req, res) => {
    try {
        const image = {
            cps_id: req.params.userId,
            data: req.file.buffer
        }
        await imageTable.upload(image)
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.post("/image/productUpload", auth, upload.single("image"), async (req, res) => {
    try {
        const image = {
            cps_id: req.body.product_id,
            data: req.file.buffer
        }
        await imageTable.upload(image)
        res.status(200).send({ success: true, error: null })
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})

router.get("/image/:id", async (req, res) => {
    try {
        let [result] = await imageTable.getImage(req.params.id)
        if(!result) {
            [result] = await imageTable.getImage("avatarDefault")
        }
        res.status(200).send(result.data)
    } catch(e) {
        res.status(200).send({ success: null, error: e })
    }
})


module.exports = router