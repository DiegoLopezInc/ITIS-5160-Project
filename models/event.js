// require modules
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// set up events schema
const eventSchema = new Schema({
  title: { type: String, required: [true, 'title is required'] },
  category: { type: String, required: [true, 'category is required'], enum: ['professional', 'social'] },
  host: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'Host is required'] },
  startDateTime: { type: Date, required: [true, 'startDateTime is required'] },
  endDateTime: { type: Date, required: [true, 'endDateTime is required'] },
  location: { type: String, required: [true, 'location is required'] },
  description: { type: String, required: [true, 'description is required'] },
  image: { type: String, required: [true, 'image path is required'] },
})

// export schema
module.exports = mongoose.model('events', eventSchema)
