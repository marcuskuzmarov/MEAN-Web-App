const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for hero info
const infosSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    eyeColor: {
        type: String,
        required: true
    },
    race: {
        type: String,
    },
    hairColor: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    publisher: {
        type: String
    },
    skinColor: {
        type: String,
        required: true
    },
    alignment: {
        type: String,
        required: true
    },
    weight: {
        type: Number
    }
}, { timestamps: true });

const Infos = mongoose.model('Infos', infosSchema);
module.exports = Infos;