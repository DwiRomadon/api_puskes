const router = require('express').Router()
const puskesmas = require('../controller/puskesmas')
const multer = require('multer')

var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(
            file.originalname.lastIndexOf("."),
            file.originalname.length
        )
        cb(null, Date.now() + ext);
    },
    destination: function (req, file, cb) {
        // console.log(file)
        cb(null, './gambar')
    }
})


var upload = multer({storage: storage}).single("gambar")

router.post("/input",upload, (req, res) => {
    puskesmas.inputData(req.body, req.file.filename)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.get("/getdata", (req, res) => {
    puskesmas.getDataPuskes()
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})
//
// router.get("/getdata/:id", (req, res) => {
//     puskesmas.getDataPetshopId(req.params.id)
//         .then((result) => res.json(result))
//         .catch((err) => res.json(err))
// })
//
router.put("/ubah/:id",upload, (req, res) => {
    puskesmas.updateData(req.body, req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})


router.put("/ubahpuskes/:id/",upload, (req, res) => {
    puskesmas.updateDataPetshop(req.body, req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.put("/ubahpuskes/:id/:hari",upload, (req, res) => {
    puskesmas.updateDataHari(req.body, req.params.id, req.params.hari)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

// router.put("/ubahpetproduk/:id/:produk",upload, (req, res) => {
//     puskesmas.updateDataProduk(req.body, req.params.id, req.params.produk)
//         .then((result) => res.json(result))
//         .catch((err) => res.json(err))
// })
//
// router.delete("/hapuspetproduk/:id/:produk",upload, (req, res) => {
//     puskesmas.hapusDataProduk(req.params.id, req.params.produk)
//         .then((result) => res.json(result))
//         .catch((err) => res.json(err))
// })
//
// router.put("/ubahpetjasa/:id/:jasa",upload, (req, res) => {
//     puskesmas.updateDataJasa(req.body, req.params.id, req.params.jasa)
//         .then((result) => res.json(result))
//         .catch((err) => res.json(err))
// })
//
// router.delete("/hapuspetjasa/:id/:jasa",upload, (req, res) => {
//     puskesmas.hapusDataJasa(req.params.id, req.params.jasa)
//         .then((result) => res.json(result))
//         .catch((err) => res.json(err))
// })

router.put("/ubahgambar/:id", upload, (req, res) => {
    puskesmas.updateDataGambar(req.file.filename, req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.post("/getjarak/:radius", (req, res) => {
    puskesmas.getJarakPuskes(req.body, req.params.radius)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})

router.delete("/hapusdata/:id", (req, res) => {
    puskesmas.hapusData(req.params.id)
        .then((result) => res.json(result))
        .catch((err) => res.json(err))
})
//
// router.post("/getjarakbyid/:radius/:id", (req, res) => {
//     puskesmas.getJarakPetshopById(req.body, req.params.radius, req.params.id)
//         .then((result) => res.json(result))
//         .catch((err) => res.json(err))
// })



module.exports = router
