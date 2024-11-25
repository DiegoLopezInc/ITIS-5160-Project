// MVC Pattern: Controller
// This file handles the business logic between Model and View

// Import the Model
const model = require('../models/event')

// Helper function to get image path based on location
function getImagePathForLocation(location) {
    const locationMap = {
        'Atkins Library': '/images/locations/atkins-library.jpg',
        'Student Union': '/images/locations/student-union.jpg',
        'CHHS Building': '/images/locations/chhs-building.jpg',
        'Woodward Hall': '/images/locations/woodward-hall.jpg',
        'Hauser Alumni Pavilion': '/images/locations/hauser-alumni-pavilion.jpg'
    };

    console.log('Getting image path for location:', location);
    const imagePath = locationMap[location] || '/images/locations/atkins-library.jpg';
    console.log('Selected image path:', imagePath);
    return imagePath;
}

exports.index = async (req, res, next) => {
    try {
        console.log('Fetching events...');
        // Get all events and populate host information
        let events = await model.find().populate('host', 'firstName lastName');
        console.log('Number of events found:', events.length);
        
        // Debug: Log each event's details including image path and update if needed
        for (const event of events) {
            console.log('Event details:', {
                title: event.title,
                location: event.location,
                currentImage: event.image
            });

            // Update image path based on location if it's not already a location-specific path
            if (!event.image || !event.image.startsWith('/images/locations/')) {
                const newImagePath = getImagePathForLocation(event.location);
                console.log(`Updating image for "${event.title}":`, {
                    from: event.image,
                    to: newImagePath,
                    location: event.location
                });
                
                event.image = newImagePath;
                await event.save();
                console.log('Event updated successfully');
            }
        }
        
        // Get unique categories
        let categories = [...new Set(events.map(event => event.category))];
        console.log('Categories found:', categories);
        
        res.render('event/index', { events, categories });
    } catch(err) {
        console.error('Error fetching events:', err);
        next(err);
    }
};

exports.new = (req, res) => {
    const locations = [
        { name: 'Atkins Library', image: '/images/locations/atkins-library.jpg' },
        { name: 'Student Union', image: '/images/locations/student-union.jpg' },
        { name: 'CHHS Building', image: '/images/locations/chhs-building.jpg' },
        { name: 'Woodward Hall', image: '/images/locations/woodward-hall.jpg' },
        { name: 'Hauser Alumni Pavilion', image: '/images/locations/hauser-alumni-pavilion.jpg' }
    ];
    
    res.render('event/new', { 
        title: 'Create New Event',
        categories: ['Academic', 'Social', 'Career', 'Other'],
        locations: locations,
        user: req.session.user,
        errorMessages: req.flash('error')
    });
};

exports.create = async (req, res, next) => {
    try {
        console.log('Creating event with body:', req.body);
        
        // Combine date and time fields
        const whenDate = new Date(req.body.when);
        const startTime = req.body.start.split(':');
        const endTime = req.body.end.split(':');
        
        const startDateTime = new Date(whenDate);
        startDateTime.setHours(parseInt(startTime[0]), parseInt(startTime[1]));
        
        const endDateTime = new Date(whenDate);
        endDateTime.setHours(parseInt(endTime[0]), parseInt(endTime[1]));
        
        // Use the image path from the form directly
        console.log('Using image path:', req.body.image);
        
        // Create event object with processed dates and image path
        let event = new model({
            title: req.body.title,
            category: req.body.category,
            description: req.body.description,
            location: req.body.location,
            host: req.session.user.id,
            startDateTime,
            endDateTime,
            image: req.body.image // Use the image path from the form
        });
        
        console.log('Saving event:', event);
        await event.save();
        console.log('Event saved successfully');
        
        req.flash('success', 'Event created successfully');
        res.redirect('/events');
    } catch(err) {
        console.error('Error creating event:', err);
        if (err.name === 'ValidationError') {
            req.flash('error', Object.values(err.errors).map(e => e.message).join(', '));
            return res.redirect('back');
        }
        next(err);
    }
};

exports.show = async (req, res, next) => {
    try {
        let event = await model.findById(req.params.id).populate('host');
        if(event) {
            res.render('./event/show', {
                title: 'Event Details',
                event
            });
        } else {
            let err = new Error('Cannot find event with id ' + req.params.id);
            err.status = 404;
            next(err);
        }
    } catch(err) {
        console.error('Error fetching event:', err);
        next(err);
    }
};

exports.edit = async (req, res, next) => {
    try {
        let event = await model.findById(req.params.id);
        console.log('Raw event data:', event);
        
        if(event) {
            // Convert Mongoose document to plain JavaScript object
            event = event.toObject();
            
            // Ensure dates are properly formatted
            if (event.startDateTime) {
                event.startDateTime = new Date(event.startDateTime);
            }
            if (event.endDateTime) {
                event.endDateTime = new Date(event.endDateTime);
            }

            console.log('Processed event data:', {
                id: event._id,
                title: event.title,
                category: event.category,
                location: event.location,
                image: event.image,
                startDateTime: event.startDateTime,
                endDateTime: event.endDateTime
            });

            const locations = [
                { name: 'Atkins Library', image: '/images/locations/atkins-library.jpg' },
                { name: 'Student Union', image: '/images/locations/student-union.jpg' },
                { name: 'CHHS Building', image: '/images/locations/chhs-building.jpg' },
                { name: 'Woodward Hall', image: '/images/locations/woodward-hall.jpg' },
                { name: 'Hauser Alumni Pavilion', image: '/images/locations/hauser-alumni-pavilion.jpg' }
            ];

            // Check if the event location exists in our predefined locations
            const locationExists = locations.some(loc => loc.name === event.location);
            if (!locationExists && event.location) {
                // If not, add it to the locations array with a default image
                locations.push({ 
                    name: event.location, 
                    image: event.image || '/images/locations/default.jpg'
                });
            }

            const renderData = {
                title: 'Edit Event',
                event,
                categories: ['Academic', 'Social', 'Career', 'Other'],
                locations,
                errorMessages: []
            };

            console.log('Rendering with data:', renderData);

            res.render('./event/editEvent', renderData);
        } else {
            let err = new Error('Cannot find event with id ' + req.params.id);
            err.status = 404;
            next(err);
        }
    } catch(err) {
        console.error('Error in edit controller:', err);
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        let event = await model.findById(req.params.id);
        if(event) {
            // Use the image path from the form directly
            console.log('Using image path:', req.body.image);
            
            // Update the event with the new data and image path
            Object.assign(event, req.body);
            await event.save();
            req.flash('success', 'Event updated successfully');
            res.redirect('/events/' + req.params.id);
        } else {
            let err = new Error('Cannot find event with id ' + req.params.id);
            err.status = 404;
            next(err);
        }
    } catch(err) {
        console.error('Error updating event:', err);
        if (err.name === 'ValidationError') {
            req.flash('error', Object.values(err.errors).map(e => e.message).join(', '));
            return res.redirect('back');
        }
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        let event = await model.findByIdAndDelete(req.params.id);
        if(event) {
            req.flash('success', 'Event deleted successfully');
            res.redirect('/events');
        } else {
            let err = new Error('Cannot find event with id ' + req.params.id);
            err.status = 404;
            next(err);
        }
    } catch(err) {
        console.error('Error deleting event:', err);
        next(err);
    }
};

// New endpoint to fix all event images
exports.fixAllEventImages = async (req, res, next) => {
    try {
        // Get all events
        let events = await model.find();
        console.log(`Found ${events.length} events to update`);

        // Update each event with the correct image path
        for (const event of events) {
            const newImagePath = getImagePathForLocation(event.location);
            console.log(`Updating event "${event.title}" (${event.location})`);
            console.log(`Old image path: ${event.image}`);
            console.log(`New image path: ${newImagePath}`);
            
            event.image = newImagePath;
            await event.save();
            console.log('Event updated successfully');
        }

        res.json({ message: 'All event images updated successfully', count: events.length });
    } catch(err) {
        console.error('Error fixing event images:', err);
        next(err);
    }
};
