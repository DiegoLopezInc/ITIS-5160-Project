// MVC Pattern: Controller
// This file handles the business logic between Model and View

// Import the Model
const model = require('../models/event')

exports.index = async (req, res, next) => {
    try {
        // Controller interacts with Model to fetch data
        let events = await model.find().populate('host', 'firstName lastName');
        // Controller passes data to View for rendering
        res.render('./event/index', {events});
    } catch(err) {
        next(err);
    }
}
