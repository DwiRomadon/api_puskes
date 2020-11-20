const puskesmas = require('../model/puskesmas.js')
const response = require('../config/response')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const haversine = require('haversine')
var distance = require('google-distance');
distance.apiKey = 'AIzaSyAukviuPQ_-gjcT7tM4dTwO1K_Kgqc-5WQ';

exports.inputData = (data, gambar) =>
    new Promise(async (resolve, reject)=>{
        const newPuskes = new puskesmas({
            namaPuskes : data.namaPuskes,
            noTelp:  data.noTelp,
            gambar: gambar,
            lat: data.lat,
            lon: data.lon,
            fasilitas: data.fasilitas
        })
        newPuskes.save()
            .then(r=>{
                resolve(response.commonSuccessMsgWithId('Berhasil menginput data', newPuskes._id))
            }).catch(err => {
                reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.updateData = (data, id) =>
    new Promise(async (resolve, reject)=>{
        puskesmas.update(
                {
                    _id: ObjectId(id)
                }, { $addToSet: data }
            )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.updateDataPetshop = (data, id) =>
    new Promise(async (resolve, reject)=>{
        console.log(data)
        puskesmas.update(
            {
                _id: ObjectId(id)
            }, { $set: data }
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

exports.updateDataHari = (data, id, hari) =>
    new Promise(async (resolve, reject)=>{
        puskesmas.update(
            {
                _id: ObjectId(id),
                "jamBuka.hari" : hari
            }, { $set: {"jamBuka.$.jam": data.jam} }
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })


// exports.updateDataProduk = (data, id, idProduk) =>
//     new Promise(async (resolve, reject)=>{
//         var produk = data.produk[0]
//         puskesmas.update(
//             {
//                 _id: ObjectId(id),
//                 "produk._id" : ObjectId(idProduk)
//             }, { $set: {
//                     "produk.$.namaProduk": produk.namaProduk,
//                     "produk.$.hargaProduk": produk.hargaProduk,
//                 }
//             }
//         )
//             .then(r=>{
//                 resolve(response.commonSuccessMsg('Berhasil merubah data'))
//             }).catch(err => {
//             reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
//         })
//     })
//
// exports.hapusDataProduk = (id, idProduk) =>
//     new Promise(async (resolve, reject)=>{
//         puskesmas.update(
//             {
//                 _id: ObjectId(id),
//             }, {
//                 $pull: {
//                     "produk" : {
//                         _id: ObjectId(idProduk)
//                     }
//                 }
//             }
//         )
//             .then(r=>{
//                 resolve(response.commonSuccessMsg('Berhasil menghapus data'))
//             }).catch(err => {
//             reject(response.commonErrorMsg('Mohon Maaf Hapus Data Gagal'))
//         })
//     })
//
// exports.updateDataJasa = (data, id, idJasa) =>
//     new Promise(async (resolve, reject)=>{
//         var jasa = data.jasa[0]
//         puskesmas.update(
//             {
//                 _id: ObjectId(id),
//                 "jasa._id" : ObjectId(idJasa)
//             }, { $set: {
//                     "jasa.$.namaJasa": jasa.namaJasa,
//                     "jasa.$.hargaJasa": jasa.hargaJasa,
//                 }
//             }
//         )
//             .then(r=>{
//                 resolve(response.commonSuccessMsg('Berhasil merubah data'))
//             }).catch(err => {
//             reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
//         })
//     })
//
// exports.hapusDataJasa = (id, idJasa) =>
//     new Promise(async (resolve, reject)=>{
//         puskesmas.update(
//             {
//                 _id: ObjectId(id),
//             }, {
//                 $pull: {
//                     "jasa" : {
//                         _id: ObjectId(idJasa)
//                     }
//                 }
//             }
//         )
//             .then(r=>{
//                 resolve(response.commonSuccessMsg('Berhasil menghapus data'))
//             }).catch(err => {
//             reject(response.commonErrorMsg('Mohon Maaf Hapus Data Gagal'))
//         })
//     })

exports.updateDataGambar = (data, id) =>
    new Promise(async (resolve, reject)=>{
        puskesmas.update(
            {
                _id: ObjectId(id)
            }, { $push: {gambar: data} }
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil merubah data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })


exports.getDataPuskes = () =>
    new Promise(async (resolve, reject)=>{
        await puskesmas.find()
            .then(r =>{
                resolve(response.commonResult(r))
            }).catch(err => {
            response.commonErrorMsg('Mohon Maaf Terjadi Kesalahan Pada Server')
        })
    })
//
// exports.getDataPetshopId = (id) =>
//     new Promise(async (resolve, reject)=>{
//         await puskesmas.findOne({
//             _id: ObjectId(id)
//         })
//             .then(r =>{
//                 resolve(response.commonResult(r))
//             }).catch(err => {
//                 response.commonErrorMsg('Mohon Maaf Terjadi Kesalahan Pada Server')
//             })
//     })
//
exports.getJarakPuskes = (data, radius) =>
    new Promise(async (resolve, reject)=>{
        await puskesmas.find()
            .then(async r =>{
                let datas = []
                let terdekat   = []
                let originLatLong = data.lat + "," + data.lon
                for (i in r){
                    let latLongDesti = r[i].lat + "," + r[i].lon
                    let jarak = await getData(originLatLong, latLongDesti).then()
                    let rad = jarak.distance.replace("km", "")

                    if(Number(rad) <= Number(radius)){
                        datas.push({
                            gambar: r[i].gambar,
                            namaPuskes: r[i].namaPuskes,
                            _id: r[i]._id,
                            noTelp: r[i].noTelp,
                            jamBuka: r[i].jamBuka,
                            fasilitas: r[i].fasilitas,
                            jarak: jarak,
                            lat: r[i].lat,
                            lon: r[i].lon
                        })
                    }else {
                        terdekat.push({
                            gambar: r[i].gambar,
                            namaPuskes: r[i].namaPuskes,
                            _id: r[i]._id,
                            noTelp: r[i].noTelp,
                            jamBuka: r[i].jamBuka,
                            fasilitas: r[i].fasilitas,
                            jarak: jarak,
                            lat: r[i].lat,
                            lon: r[i].lon
                        })
                    }
                    if (Number(radius) === 0){
                        datas.push({
                            gambar: r[i].gambar,
                            namaPuskes: r[i].namaPuskes,
                            _id: r[i]._id,
                            noTelp: r[i].noTelp,
                            jamBuka: r[i].jamBuka,
                            fasilitas: r[i].fasilitas,
                            jarak: jarak,
                            lat: r[i].lat,
                            lon: r[i].lon
                        })
                    }
                }

                if (datas.length === 0){
                    datas = terdekat.sort(compare)
                    let dataKu = []
                    dataKu = [datas[0]]
                    resolve(response.commonResult(dataKu))
                }else {
                    resolve(response.commonResult(datas.sort(compare)))
                }
            }).catch(err => {
                response.commonErrorMsg('Mohon Maaf Terjadi Kesalahan Pada Server')
            })
    })
//
// exports.getJarakPetshopById = (data, radius,id) =>
//     new Promise(async (resolve, reject)=>{
//         await puskesmas.find({
//             idUser: ObjectId(id)
//         })
//             .then(async r =>{
//                 let datas = []
//                 let originLatLong = data.lat + "," + data.lon
//                 for (i in r){
//                     let latLongDesti = r[i].lat + "," + r[i].lon
//                     let jarak = await getData(originLatLong, latLongDesti).then()
//                     let rad = jarak.distance.replace("km", "")
//                     if(Number(rad) <= Number(radius)){
//                         datas.push({
//                             gambar: r[i].gambar,
//                             namaPetshop: r[i].namaPetshop,
//                             _id: r[i]._id,
//                             noTelp: r[i].noTelp,
//                             jamBuka: r[i].jamBuka,
//                             produk: r[i].produk,
//                             jasa: r[i].jasa,
//                             jarak: jarak,
//                             lat: r[i].lat,
//                             lon: r[i].lon
//                         })
//                     }
//                     if (Number(radius) === 0){
//                         datas.push({
//                             gambar: r[i].gambar,
//                             namaPetshop: r[i].namaPetshop,
//                             _id: r[i]._id,
//                             noTelp: r[i].noTelp,
//                             jamBuka: r[i].jamBuka,
//                             produk: r[i].produk,
//                             jasa: r[i].jasa,
//                             jarak: jarak,
//                             lat: r[i].lat,
//                             lon: r[i].lon
//                         })
//                     }
//                 }
//                 resolve(response.commonResult(datas.sort(compare)))
//             }).catch(err => {
//                 response.commonErrorMsg('Mohon Maaf Terjadi Kesalahan Pada Server')
//             })
//     })

exports.hapusData = (id) =>
    new Promise(async (resolve, reject)=>{
        puskesmas.deleteOne(
            {
                _id: ObjectId(id)
            },
        )
            .then(r=>{
                resolve(response.commonSuccessMsg('Berhasil menghapus data'))
            }).catch(err => {
            reject(response.commonErrorMsg('Mohon Maaf Input Data Gagal'))
        })
    })

const getData = (latLongOrigin, latLongDesti) =>
    new Promise(async (resolve, reject)=>{
        await distance.get(
            {
                origin: latLongOrigin,
                destination: latLongDesti
            },
            function(err, data) {
                if (err) {return console.log(err);}
                resolve(data)

            });
    })


const compare = (a, b) => {
    const jarakA = Number(a.jarak.distance.replace("km", "").toUpperCase());
    const jarakB = Number(b.jarak.distance.replace("km", "").toUpperCase());
    let comparison = 0;
    if (jarakA > jarakB) {
        comparison = 1;
    } else if (jarakA < jarakB) {
        comparison = -1;
    }
    return comparison;
}


