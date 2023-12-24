const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for hero info
const accUseSchema = new Schema({
    policy: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const AccUse = mongoose.model('AccUse', accUseSchema);
module.exports = AccUse;