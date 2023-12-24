const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for lists
const listsSchema = new Schema({
    owner: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        required: true,
        default: false
    },
    lName: {
        type: String,
        required: true
    },
    lDesc: {
        type: String,
        required: false
    },
    ids: {
        type: Array,
        required: true
    },
    avgRating: {
        type: String,
        required: false,
        default: 'N/A'
    },
    totalRatings: {
        type: Number,
        required: false,
        default: 0
    },
}, { timestamps: true });

const Lists = mongoose.model('Lists', listsSchema);
module.exports = Lists;