const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for hero info
const reviewsSchema = new Schema({
    lName: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
    },
    visible: {
        type: Boolean,
        required: true,
        default: true
    },
}, { timestamps: true });

const Reviews = mongoose.model('Reviews', reviewsSchema);
module.exports = Reviews;