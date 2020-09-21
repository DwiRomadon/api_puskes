const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    namaPuskes: {
        type: String
    },
    jamBuka : [
        {
            hari: {type: String},
            jam: {type: String}
        }
    ],
    noTelp: {
        type : String
    },
    gambar: Array,
    lat: String,
    lon: String,
})

module.exports = mongoose.model('puskes', userSchema)
