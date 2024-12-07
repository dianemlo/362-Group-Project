import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
import { app, server } from './socket/socket.js';
import connectToMongoDB from './db/connectToMongoDB.js';

// Mock the connectToMongoDB to avoid actually connecting to MongoDB during tests
vi.mock('./db/connectToMongoDB.js');
describe('Server Setup and Routes', () => {
    beforeEach(() => {
      // Clear the mocks before each test to ensure isolated tests
      connectToMongoDB.mockClear();
    });
  
    it('should connect to MongoDB when server starts', async () => {
      // Spy on the connectToMongoDB function to ensure it's called
      await request(app).get('/'); // Make any request to initiate server startup
      expect(connectToMongoDB).toHaveBeenCalledTimes(1); // Should be called once when server starts
    });
  
    it('should respond with a 200 status for the auth route', async () => {
      // Mock the authRoutes to return a dummy response
      const response = await request(app).get('/api/auth');
      expect(response.status).toBe(200);
    });
  
    it('should respond with a 200 status for the message route', async () => {
      const response = await request(app).get('/api/messages');
      expect(response.status).toBe(200);
    });
  
    it('should respond with a 200 status for the users route', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
    });
  
    it('should return a 404 for undefined routes', async () => {
      const response = await request(app).get('/undefined-route');
      expect(response.status).toBe(404);
    });
  });