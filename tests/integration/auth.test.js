const request = require('supertest');
const app = require('../../app');
const User = require('../../models/user');
const { describe, it, expect, beforeEach } = require('@jest/globals');

describe('Authentication Tests', () => {
    describe('POST /users', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/users')
                .send({
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@uncc.edu',
                    password: 'TestPass123!'
                });
            
            expect(res.statusCode).toBe(302); // Redirect after successful signup
            const user = await User.findOne({ email: 'test@uncc.edu' });
            expect(user).toBeTruthy();
        });

        it('should not create user with duplicate email', async () => {
            // First create a user
            await User.create({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@uncc.edu',
                password: 'TestPass123!'
            });

            // Try to create another user with same email
            const res = await request(app)
                .post('/users')
                .send({
                    firstName: 'Test2',
                    lastName: 'User2',
                    email: 'test@uncc.edu',
                    password: 'TestPass123!'
                });
            
            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /users/login', () => {
        beforeEach(async () => {
            await User.create({
                firstName: 'Test',
                lastName: 'User',
                email: 'test@uncc.edu',
                password: 'TestPass123!'
            });
        });

        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/users/login')
                .send({
                    email: 'test@uncc.edu',
                    password: 'TestPass123!'
                });
            
            expect(res.statusCode).toBe(302); // Redirect after successful login
            expect(res.headers['set-cookie']).toBeDefined(); // Session cookie should be set
        });

        it('should not login with invalid password', async () => {
            const res = await request(app)
                .post('/users/login')
                .send({
                    email: 'test@uncc.edu',
                    password: 'WrongPass123!'
                });
            
            expect(res.statusCode).toBe(401);
        });
    });
}); 