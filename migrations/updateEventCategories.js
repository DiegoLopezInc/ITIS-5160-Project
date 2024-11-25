require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/event');

// Function to determine category based on event title and description
function determineCategory(event) {
    const title = event.title.toLowerCase();
    const description = event.description.toLowerCase();

    // Career-related keywords
    if (title.includes('career') || 
        title.includes('job') || 
        title.includes('interview') || 
        title.includes('resume') ||
        description.includes('career') || 
        description.includes('employer') || 
        description.includes('professional')) {
        return 'career';
    }

    // Academic-related keywords
    if (title.includes('workshop') || 
        title.includes('study') || 
        title.includes('lecture') || 
        title.includes('learning') ||
        description.includes('learn') || 
        description.includes('education') || 
        description.includes('academic')) {
        return 'academic';
    }

    // Social-related keywords
    if (title.includes('party') || 
        title.includes('mixer') || 
        title.includes('game') || 
        title.includes('social') ||
        description.includes('social') || 
        description.includes('fun') || 
        description.includes('meet') ||
        description.includes('food')) {
        return 'social';
    }

    // Default category
    return 'other';
}

async function updateEventCategories() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.HL_MONGODB_URL);
        console.log('Connected to MongoDB Atlas');

        // Get all events that don't have a category
        const events = await Event.find({ category: { $exists: false } });
        console.log(`Found ${events.length} events without categories`);

        // Update each event
        for (const event of events) {
            const category = determineCategory(event);
            console.log(`Updating event "${event.title}" with category: ${category}`);
            
            await Event.findByIdAndUpdate(event._id, { category });
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the migration
updateEventCategories();
