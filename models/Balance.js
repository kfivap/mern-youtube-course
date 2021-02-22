const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    money: {type: Number, default: 0 },
    owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Balance', schema)