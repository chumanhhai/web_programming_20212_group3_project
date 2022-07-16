const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const data = jwt.verify(token, process.env.SECRET_JWT_CODE)
        req.params.userId = data.userId
        next()
    } catch(e) {
        res.status(200).send({ sucess: null, error: { message: "Authenticate failed!" } })
    }
}

module.exports = auth