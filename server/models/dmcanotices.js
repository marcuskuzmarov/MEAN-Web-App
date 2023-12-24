const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema for hero info
const dmcaNoticesSchema = new Schema({
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
    dateReqRcvd: {
        type: Date,
    },
    dateNotSent: {
        type: Date,
    },
    dateDisRvcd: {
        type: Date,
    },
    notes: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Processed'],
        default: 'Active',
    },
}, { timestamps: true });

const DMCANotices = mongoose.model('DMCANotices', dmcaNoticesSchema);
module.exports = DMCANotices;