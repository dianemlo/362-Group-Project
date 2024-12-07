import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest'; // Use supertest to simulate HTTP requests
import express from 'express';
import userRouter from '../routes/user.route.js';
import protectRoute from '../backend/middleware/protectRoute.js';
import { getUsersForSidebar } from '../backend/controllers/user.controller.js';

// Create a new Express app instance for testing
const app = express();

// Use the user router and mock middleware
app.use(express.json());  // For parsing JSON bodies (if necessary)
app.use('/api/users', userRouter);  // Register the user routes

// Mock the protectRoute middleware
vi.mock('../backend/middleware/protectRoute.js');
vi.mock('../backend/controllers/user.controller.js');

describe('User Routes', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    protectRoute.mockClear();
    getUsersForSidebar.mockClear();
  });

  it('should return a list of users for the sidebar', async () => {
    // Mock the controller to return a test response
    const mockUsers = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }];
    getUsersForSidebar.mockImplementationOnce((req, res) => {
      res.status(200).json(mockUsers);
    });

    // Mock the protectRoute middleware to call next() immediately
    protectRoute.mockImplementationOnce((req, res, next) => next());

    const response = await request(app).get('/api/users');  // Send GET request to the route

    // Check the response
    expect(response.status).toBe(200); // The status should be 200
    expect(response.body).toEqual(mockUsers); // The response body should match the mock users
    expect(getUsersForSidebar).toHaveBeenCalledOnce(); // Ensure the controller was called once
    expect(protectRoute).toHaveBeenCalledOnce(); // Ensure the middleware was called once
  });

  it('should return 401 if the protectRoute middleware rejects', async () => {
    // Mock the protectRoute middleware to send a 401 Unauthorized status
    protectRoute.mockImplementationOnce((req, res, next) => {
      res.status(401).json({ message: 'Unauthorized' });
    });

    const response = await request(app).get('/api/users');  // Send GET request

    // Check the response for Unauthorized error
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Unauthorized' }); // Match the expected error message
    expect(getUsersForSidebar).not.toHaveBeenCalled(); // Ensure the controller wasn't called
  });
});
