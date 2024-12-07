import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signup, login, logout } from '../backend/auth.controller.js';
import User from '../backend/models/user.model.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../backend/utils/generateToken.js';

vi.mock('../backend/models/user.model.js');
vi.mock('bcryptjs');
vi.mock('../backend/utils/generateToken.js');

describe('Auth Controller Tests', () => {
  let res;
  let req;

  beforeEach(() => {
    // Mocking response object
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
    };

    // Mocking request object
    req = {
      body: {},
    };
  });

  // TEST: signup controller
  describe('signup', () => {
    it('should return 400 if passwords do not match', async () => {
      req.body = {
        fullName: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        confirmPassword: 'password124',
        gender: 'male',
      };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Passwords do not match!' });
    });

    it('should return 400 if the username already exists', async () => {
      req.body = {
        fullName: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
      };

      // Mocking the user already existing in the database
      User.findOne.mockResolvedValue({ username: 'johndoe' });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Username already exists!' });
    });

    it('should successfully create a new user', async () => {
      req.body = {
        fullName: 'John Doe',
        username: 'johndoe',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'male',
      };

      // Mock bcrypt methods
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.findOne.mockResolvedValue(null); // No existing user
      User.prototype.save.mockResolvedValue({
        _id: 'userId',
        fullName: 'John Doe',
        username: 'johndoe',
        profilePic: 'https://avatar.iran.liara.run/public/boy?username=johndoe',
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: 'userId',
        fullName: 'John Doe',
        username: 'johndoe',
        profilePic: 'https://avatar.iran.liara.run/public/boy?username=johndoe',
      });
      expect(generateTokenAndSetCookie).toHaveBeenCalledWith('userId', res);
    });
  });

  // TEST: login controller
  describe('login', () => {
    it('should return 400 if username or password is invalid', async () => {
      req.body = {
        username: 'johndoe',
        password: 'password123',
      };

      // Mocking user not found or invalid password
      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid username or password' });
    });

    it('should successfully login a user', async () => {
      req.body = {
        username: 'johndoe',
        password: 'password123',
      };

      const user = {
        _id: 'userId',
        fullName: 'John Doe',
        username: 'johndoe',
        profilePic: 'https://avatar.iran.liara.run/public/boy?username=johndoe',
        password: 'hashedPassword', // Assume this is the hashed password in DB
      };

      // Mocking bcrypt comparison
      bcrypt.compare.mockResolvedValue(true);
      User.findOne.mockResolvedValue(user);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _id: 'userId',
        fullName: 'John Doe',
        username: 'johndoe',
        profilePic: 'https://avatar.iran.liara.run/public/boy?username=johndoe',
      });
      expect(generateTokenAndSetCookie).toHaveBeenCalledWith('userId', res);
    });
  });

  // TEST: logout controller
  describe('logout', () => {
    it('should logout the user successfully', async () => {
      await logout(req, res);

      expect(res.cookie).toHaveBeenCalledWith('jwt', '', { maxAge: 0 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
  });
});
