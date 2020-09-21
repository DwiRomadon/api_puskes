const router = require('express').Router()
const user = require('../controller/user')

router.post("/registrasi", (req, res) => {
    user.registrasiUser(req.body)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.post("/login", (req, res) => {
    user.login(req.body)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

module.exports = router
