import { describe, it, expect, vi } from 'vitest';
import { app } from "../backend/socket/socket.js"
import request from 'supertest'; // For making requests to the Express app
import express from 'express';
import authRoutes from '../backend/routes/auth.routes.js'; // Import the routes

// Mocking the controller functions
vi.mock('../controllers/auth.controller.js', () => ({
  signup: vi.fn((req, res) => res.status(201).json({ message: 'User signed up' })),
  login: vi.fn((req, res) => res.status(200).json({ message: 'User logged in' })),
  logout: vi.fn((req, res) => res.status(200).json({ message: 'Logged out successfully' })),
}));

describe('Auth Routes', () => {
  it('should call the signup route and return 201 status', async () => {
    const response = await request(app)
      .post('/api/signup')
      .send({ username: 'testuser', password: 'password' }); // sample data

    expect(response.status).toBe(201);
    //expect(response.body.message).toBe('User signed up');
  });

  it('should call the login route and return 200 status', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'testuser', password: 'password' }); // sample data

    expect(response.status).toBe(200);
    //expect(response.body.message).toBe('User logged in');
  });

  it('should call the logout route and return 200 status', async () => {
    const response = await request(app)
      .post('/api/logout')
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logged out successfully');
  });
});
