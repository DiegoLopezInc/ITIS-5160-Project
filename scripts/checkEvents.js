require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB Atlas
mongoose.connect(process.env.HL_MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        const Event = require('../models/event');
        
        // Find all events and log their details
        return Event.find().then(events => {
            console.log('Events found:', events.length);
            events.forEach(event => {
                console.log('\nEvent:', {
                    title: event.title,
                    location: event.location,
                    image: event.image
                });
            });
        });
    })
    .then(() => {
        console.log('\nDone checking events');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
