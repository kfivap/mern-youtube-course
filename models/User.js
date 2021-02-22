const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    money: {type: Number, required: true, default: 0},
    isCasinoAccount: {type: Boolean},

    links: [{type: Types.ObjectId, ref: 'Link'}],
    //balance: [{type: Types.ObjectId, ref: 'Balance'}]
})

module.exports = model('User', schema)