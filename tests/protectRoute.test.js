import { describe, it, expect, vi, beforeEach } from "vitest";
import protectRoute from "../middleware/protectRoute.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { createRequest, createResponse } from "node-mocks-http";  // To mock HTTP requests and responses

// Mock the dependencies
vi.mock("jsonwebtoken");
vi.mock("../models/user.model.js");

describe("protectRoute middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = createRequest();
    res = createResponse();
    next = vi.fn();  // Mock the next function
  });

  it("should return 401 if no token is provided", async () => {
    req.cookies = {};  // No JWT in cookies

    await protectRoute(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getData()).toEqual({ error: "Unauthorized - No Token Provided" });
  });

  it("should return 401 if the token is invalid", async () => {
    const invalidToken = "invalidToken";
    req.cookies = { jwt: invalidToken };

    jwt.verify.mockImplementationOnce(() => { throw new Error("Invalid Token") });

    await protectRoute(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res._getData()).toEqual({ error: "Unauthorized - Invalid Token" });
  });

  it("should return 404 if the user is not found", async () => {
    const token = jwt.sign({ userId: "123" }, process.env.JWT_SECRET);
    req.cookies = { jwt: token };

    jwt.verify.mockImplementationOnce(() => ({ userId: "123" }));

    // Mock User.findById to return null, simulating user not found
    User.findById.mockResolvedValueOnce(null);

    await protectRoute(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getData()).toEqual({ error: "User not found" });
  });

  it("should call next() if the token is valid and user is found", async () => {
    const token = jwt.sign({ userId: "123" }, process.env.JWT_SECRET);
    req.cookies = { jwt: token };

    jwt.verify.mockImplementationOnce(() => ({ userId: "123" }));

    const mockUser = { id: "123", name: "John Doe" };
    User.findById.mockResolvedValueOnce(mockUser);

    await protectRoute(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);  // Check if the next middleware was called
    expect(req.user).toEqual(mockUser);  // Ensure that the user was set on the request object
  });

  it("should return 500 if there's an error during token verification or user lookup", async () => {
    const token = jwt.sign({ userId: "123" }, process.env.JWT_SECRET);
    req.cookies = { jwt: token };

    // Mock jwt.verify to throw an error
    jwt.verify.mockImplementationOnce(() => { throw new Error("Some error") });

    await protectRoute(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual({ error: "Internal server error" });
  });
});
