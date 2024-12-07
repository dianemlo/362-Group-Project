import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose'; 
import { connectToMongoDB } from '../backend/db/connectToMongoDB.js';

describe('connectToMongoDB', () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    // Mock console.log and console.error to capture log output during the test
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the console mocks after each test
    vi.restoreAllMocks();
  });

  it('should log "Connected to MongoDB" on successful connection', async () => {
    // Mock mongoose.connect to resolve successfully
    vi.spyOn(mongoose, 'connect').mockResolvedValueOnce();

    await connectToMongoDB();

    // Ensure the log message is as expected
    expect(consoleLogSpy).toHaveBeenCalledWith('Connected to MongoDB');
  });

  it('should log the error message on failed connection', async () => {
    // Mock mongoose.connect to reject with an error
    const errorMessage = 'Failed to connect';
    vi.spyOn(mongoose, 'connect').mockRejectedValueOnce(new Error(errorMessage));

    await connectToMongoDB();

    // Ensure the error message is logged
    expect(consoleLogSpy).toHaveBeenCalledWith('Error connecting to MongoDB', errorMessage);
  });
});
