const user = require('../model/user')
const response = require('../config/response')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


exports.registrasiUser = (data) =>
    new Promise(async (resolve, reject)=>{
        user.findOne({
            username: data.username
        }).then(res=> {
            if (res){
                reject(response.commonErrorMsg("Username sudah digunakan"))
            }else {
                user.create(data)
                    .then(r => {
                        resolve(response.commonSuccessMsg("Berhasil Registrasi"))
                    }).catch(err =>{
                    reject(response.commonErrorMsg("Terjadi masalah pada server"))
                })
            }
        }).catch(err=>{
            reject(response.commonErrorMsg("Terjadi masalah pada server"))
        })
    })


exports.login = (data) =>
    new Promise(async (resolve, reject)=>{
        user.findOne({
            username: data.username
        }).then(res=> {
            if(res) {
                user.findOne({
                    password: data.password,
                    username: res.username
                }).then(r => {
                    if(r){
                        resolve(response.commonResult(r))
                    }else {
                        reject(response.commonErrorMsg("Password salah"))
                    }
                }).catch(err => {
                    reject(response.commonErrorMsg("Terjadi masalah pada server"))
                })
            }else {
                reject(response.commonErrorMsg("Username tidak ditemukan"))
            }
        }).catch(err=>{
            reject(response.commonErrorMsg("Terjadi masalah pada server"))
        })
    })
