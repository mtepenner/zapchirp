const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth.routes');
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// Mock dependencies
jest.mock('../models/user.model');
jest.mock('../utils/generateToken', () => jest.fn());
jest.mock('bcryptjs');

// Setup a mock Express app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/auth/login - should authenticate a valid user', async () => {
    const mockUser = {
      _id: 'mock-id-123',
      fullName: 'Test User',
      username: 'testuser',
      profilePic: 'https://avatar.url',
    };

    // Simulate finding the user in the database
    User.findOne.mockResolvedValue(mockUser);
    // Simulate successful password match
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe('mock-id-123');
    expect(res.body.username).toBe('testuser');
    expect(generateToken).toHaveBeenCalledWith('mock-id-123', expect.any(Object)); // Ensures token was generated and attached to res
  });

  it('POST /api/auth/login - should return 400 for invalid credentials', async () => {
    // Simulate user not found
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wronguser', password: 'wrongpassword' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Invalid username or password');
  });
});
