const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    namaPetshop: {
        type: String
    },
    username : {
        type: String
    },
    password : {
        type: String
    },
})

module.exports = mongoose.model('user', userSchema)
