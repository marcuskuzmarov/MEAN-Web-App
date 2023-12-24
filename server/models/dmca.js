const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for hero info
const dmcaSchema = new Schema({
    policy: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const DMCA = mongoose.model('DMCA', dmcaSchema);
module.exports = DMCA;