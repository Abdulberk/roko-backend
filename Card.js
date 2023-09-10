const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CardSchema = new Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    imageUrl: {type: String, required: true},
    desc: {type: String, required: true},
    currency: {type: String, required: true},
    id: {type: Number, required: true},
    discount: {type: Number, required: true},
    to: {type: String, required: true},
});

const Card = mongoose.model('Card', CardSchema);

module.exports = Card;

