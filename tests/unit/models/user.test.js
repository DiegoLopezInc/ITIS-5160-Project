const User = require('../../../models/user');
const mongoose = require('mongoose');

describe('User Model Test', () => {
    it('should validate a valid user', async () => {
        const validUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@uncc.edu',
            password: 'ValidPass123!'
        };
        const user = new User(validUser);
        const savedUser = await user.save();
        
        expect(savedUser._id).toBeDefined();
        expect(savedUser.email).toBe(validUser.email);
    });

    it('should fail validation for invalid email', async () => {
        const userWithInvalidEmail = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'invalid-email',
            password: 'ValidPass123!'
        };
        
        try {
            const user = new User(userWithInvalidEmail);
            await user.save();
        } catch (error) {
            expect(error.errors.email).toBeDefined();
        }
    });

    it('should hash password before saving', async () => {
        const user = new User({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@uncc.edu',
            password: 'ValidPass123!'
        });
        
        await user.save();
        expect(user.password).not.toBe('ValidPass123!');
        expect(user.password).toHaveLength(60); // bcrypt hash length
    });
}); 