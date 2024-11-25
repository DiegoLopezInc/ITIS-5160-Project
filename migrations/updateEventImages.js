require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/event');

// Available images in public/images folder
const availableImages = [
    '/images/Aerial_Atkins_Clocktower.jpg',
    '/images/Aerial_Atkins_Friday.jpg',
    '/images/Aerial_CHHS_Atkins_Clocktower.jpg',
    '/images/Aerial_Clocktower_Atkins.jpg',
    '/images/Aerial_CoED_CHHS_StudentUnion.jpg',
    '/images/Aerial_Woodward_Campus.jpg',
    '/images/Woodward_from_Hauser_Alumni_Pavilion.jpg'
];

// Connect to MongoDB
mongoose.connect(process.env.HL_MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
        updateEventImages();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });

async function updateEventImages() {
    try {
        // Get all events
        const events = await Event.find();
        console.log(`Found ${events.length} events to update`);

        for (let event of events) {
            // Assign a random image from the available images
            const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
            
            // Update the event with the new image path
            await Event.findByIdAndUpdate(event._id, {
                image: randomImage
            });
            
            console.log(`Updated event "${event.title}" with image: ${randomImage}`);
        }

        console.log('Successfully updated all event images');
        process.exit(0);
    } catch (error) {
        console.error('Error updating event images:', error);
        process.exit(1);
    }
}
