require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/event');

// Map of image paths to corresponding locations
const locationMap = {
    '/images/Aerial_Atkins_Clocktower.jpg': 'Atkins Library Clocktower',
    '/images/Aerial_Atkins_Friday.jpg': 'Atkins Library',
    '/images/Aerial_CHHS_Atkins_Clocktower.jpg': 'College of Health and Human Services',
    '/images/Aerial_Clocktower_Atkins.jpg': 'University Clocktower',
    '/images/Aerial_CoED_CHHS_StudentUnion.jpg': 'Student Union',
    '/images/Aerial_Woodward_Campus.jpg': 'Woodward Hall',
    '/images/Woodward_from_Hauser_Alumni_Pavilion.jpg': 'Hauser Alumni Pavilion'
};

// Connect to MongoDB
mongoose.connect(process.env.HL_MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        updateEventLocations();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });

async function updateEventLocations() {
    try {
        // Get all events
        const events = await Event.find();
        console.log(`Found ${events.length} events to update`);

        for (let event of events) {
            // Get the location based on the event's image
            const location = locationMap[event.image];
            
            if (location) {
                // Update the event with the new location
                await Event.findByIdAndUpdate(event._id, {
                    location: location
                });
                
                console.log(`Updated event "${event.title}" location to: ${location}`);
            } else {
                console.log(`No matching location found for event "${event.title}" with image: ${event.image}`);
            }
        }

        console.log('Successfully updated all event locations');
        process.exit(0);
    } catch (error) {
        console.error('Error updating event locations:', error);
        process.exit(1);
    }
}
