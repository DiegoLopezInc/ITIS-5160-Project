const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, 
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String, 
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format']
    },
    password: {
        type: String, 
        required: [true, 'Password is required'],
        minLength: [8, 'Password should be at least 8 characters']
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch(error) {
        next(error);
    }
});

// Compare login password with stored hash
userSchema.methods.comparePassword = async function(loginPassword) {
    return await bcrypt.compare(loginPassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 