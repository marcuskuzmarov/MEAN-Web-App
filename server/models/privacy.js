const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for hero info
const privacySchema = new Schema({
    policy: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Privacy = mongoose.model('Privacy', privacySchema);
module.exports = Privacy;