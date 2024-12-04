const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event is required']
    },
    status: {
        type: String,
        required: [true, 'Status is required'],
        enum: {
            values: ['YES', 'NO', 'MAYBE'],
            message: 'Status must be either YES, NO, or MAYBE'
        }
    }
}, { timestamps: true });

// Ensure only one RSVP per user per event
rsvpSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', rsvpSchema);
