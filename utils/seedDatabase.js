const mongoose = require('mongoose');
const User = require('../models/user');
const Event = require('../models/event');

// Add this at the top of the file
require('dotenv').config();

// Use the environment variable
const mongoURI = process.env.HL_MONGODB_URL;

// Sample Users
const users = [
    {
        firstName: 'Diego',
        lastName: 'Lopez',
        email: 'dlopez18@uncc.edu',
        password: 'Rm4k7XqIqsSfJsKM'
    },
    {
        firstName: 'test',
        lastName: 'test',
        email: 'test@uncc.edu',
        password: 'XfXwjmHixsHDttdf'
    }
];

// Sample Events
const createEvents = (userIds) => {
    return [
        // Professional Events
        {
            title: 'Tech Career Fair',
            category: 'professional',
            host: userIds[0],
            startDateTime: new Date('2024-04-15T13:00:00'),
            endDateTime: new Date('2024-04-15T17:00:00'),
            location: 'Student Union',
            description: 'Annual tech career fair with major employers',
            image: '/images/career-fair.jpg'
        },
        {
            title: 'Resume Workshop',
            category: 'professional',
            host: userIds[1],
            startDateTime: new Date('2024-04-20T14:00:00'),
            endDateTime: new Date('2024-04-20T16:00:00'),
            location: 'Woodward Hall 130',
            description: 'Learn how to create an effective tech resume',
            image: '/images/resume-workshop.jpg'
        },
        {
            title: 'Mock Interviews',
            category: 'professional',
            host: userIds[0],
            startDateTime: new Date('2024-04-25T10:00:00'),
            endDateTime: new Date('2024-04-25T15:00:00'),
            location: 'PORTAL Building',
            description: 'Practice technical interviews with industry professionals',
            image: '/images/mock-interviews.jpg'
        },
        // Social Events
        {
            title: 'Welcome Mixer',
            category: 'social',
            host: userIds[1],
            startDateTime: new Date('2024-04-10T18:00:00'),
            endDateTime: new Date('2024-04-10T20:00:00'),
            location: 'Student Union Rotunda',
            description: 'Meet and greet with ColorStack members',
            image: '/images/welcome-mixer.jpg'
        },
        {
            title: 'Game Night',
            category: 'social',
            host: userIds[0],
            startDateTime: new Date('2024-04-22T19:00:00'),
            endDateTime: new Date('2024-04-22T22:00:00'),
            location: 'Prospector Game Room',
            description: 'Video games and board games night',
            image: '/images/game-night.jpg'
        },
        {
            title: 'End of Semester Party',
            category: 'social',
            host: userIds[1],
            startDateTime: new Date('2024-05-01T17:00:00'),
            endDateTime: new Date('2024-05-01T20:00:00'),
            location: 'Crown Commons',
            description: 'Celebrate the end of the semester with food and music',
            image: '/images/semester-party.jpg'
        }
    ];
};

// Function to seed the database
async function seedDatabase() {
    try {
        if (!mongoURI) {
            throw new Error('MongoDB connection string not found in environment variables');
        }
        
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB Atlas');

        // Clear existing data
        await User.deleteMany({});
        await Event.deleteMany({});
        console.log('Cleared existing data');

        // Create users
        const createdUsers = await User.create(users);
        console.log('Created users');

        // Get user IDs
        const userIds = createdUsers.map(user => user._id);

        // Create events
        await Event.create(createEvents(userIds));
        console.log('Created events');

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedDatabase(); 