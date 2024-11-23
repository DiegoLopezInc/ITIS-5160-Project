// MVC Pattern: Model
// This file defines the data structure and business logic for events

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Model Schema: Defines the structure of event documents in the database
const eventSchema = new Schema({
    title: { type: String, required: [true, 'title is required'] },
    // Host field creates relationship between User and Event models
    host: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Host is required'] },
    // Date and time of the event
    startDateTime: { type: Date, required: [true, 'Start date and time are required'] },
    endDateTime: { type: Date, required: [true, 'End date and time are required'] },
    // Location of the event
    location: { type: String, required: [true, 'Location is required'] },
    // Description of the event
    description: { type: String, required: [true, 'Description is required'] },
    // Image path of the event
    image: { type: String, required: [true, 'Image path is required'] }
})

// Export the model for use in controllers
module.exports = mongoose.model('events', eventSchema)
