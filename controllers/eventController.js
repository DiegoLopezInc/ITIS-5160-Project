// require modules
const model = require('../models/event')


// GET /events: send all events
exports.index = async (req, res, next) => {
    try {
        let events = await model.find().populate('host', 'firstName lastName');
        res.render('./event/index', {events});
    } catch(err) {
        next(err);
    }
}

// GET /events/create: send html form for creating new event
exports.new = (req, res) => {
    res.render('./event/new')
}

// POST /events: create new event
exports.create = async (req, res, next) => {
    try {
        let event = new model(req.body);
        event.host = req.session.user.id;  // Add host information
        await event.save();
        req.flash('success', 'Event created successfully');
        res.redirect('/events');
    } catch(err) {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    }
}

// GET /events/:id: send details about event id
exports.show = async (req, res, next) => {
    try {
        let id = req.params.id;
        let event = await model.findById(id).populate('host', 'firstName lastName');
        if(event) {
            res.render('./event/show', {event});
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch(err) {
        next(err);
    }
}

// GET /events/:id/edit: send html form for editing existing event
exports.edit = async (req, res, next) => {
    try {
        let id = req.params.id;
        let event = await model.findById(id);
        if(event) {
            res.render('./event/edit', {event});
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    } catch(err) {
        next(err);
    }
}

// PUT /events/:id: update event id
exports.update = async (req, res, next) => {
    try {
        let event = await model.findByIdAndUpdate(req.params.id, req.body, {runValidators: true});
        if(event) {
            req.flash('success', 'Event updated successfully');
            res.redirect('/events/'+req.params.id);
        } else {
            let err = new Error('Cannot find a event with id ' + req.params.id);
            err.status = 404;
            next(err);
        }
    } catch(err) {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    }
}

// DELETE /events/:id: delete event id
exports.delete = async (req, res, next) => {
    try {
        let event = await model.findByIdAndDelete(req.params.id);
        if(event) {
            req.flash('success', 'Event deleted successfully');
            res.redirect('/events');
        } else {
            let err = new Error('Cannot find a event with id ' + req.params.id);
            err.status = 404;
            next(err);
        }
    } catch(err) {
        next(err);
    }
}
