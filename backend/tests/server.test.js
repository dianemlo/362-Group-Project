const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../socket/socket.js'); 
const User = require('../models/user.model.js'); 

jest.mock('../models/user.model.js', () => {
    return {
      findOne: jest.fn(),
      save: jest.fn(),
    };
  });

describe('POST /signup', () => {
  
  it('should return 400 if passwords do not match', async () => {
    const response = await request(app)
      .post('/signup')
      .send({
        fullName: 'John Doe',
        username: 'john123',
        password: 'password123',
        confirmPassword: 'password321', // mismatched password
        gender: 'male',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Passwords do not match!');
  });

  it('should return 400 if username already exists', async () => {
    // Mock the behavior of finding a user with the same username
    User.findOne.mockResolvedValueOnce({ username: 'john123' });

    const response = await request(app)
      .post('/signup')
      .send({
        fullName: 'John Doe',
        username: 'john123', // Existing username
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username already exists!');
  });

  it('should return 201 and create a new user if all validations pass', async () => {
    // Mock the behavior of finding no existing user
    User.findOne.mockResolvedValueOnce(null);

    // Mock the bcrypt functions
    bcrypt.genSalt.mockResolvedValueOnce('salt');
    bcrypt.hash.mockResolvedValueOnce('hashedPassword');

    // Mock the User model's save method
    User.prototype.save = jest.fn().mockResolvedValueOnce({
      _id: '1',
      fullName: 'John Doe',
      username: 'john123',
      profilePic: 'profile-pic-url',
    });

    const response = await request(app)
      .post('/signup')
      .send({
        fullName: 'John Doe',
        username: 'john123',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
      });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe('john123');
    expect(response.body.profilePic).toBe('profile-pic-url');
  });

  it('should return 500 if there is a server error', async () => {
    // Mock the error scenario
    User.findOne.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post('/signup')
      .send({
        fullName: 'John Doe',
        username: 'john123',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });

});
