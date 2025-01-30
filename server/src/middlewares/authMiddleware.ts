import { NextFunction, Request, Response } from "express";
import admin from "../config/firebase"; // Ensure this correctly initializes Firebase Admin SDK

// Extend Express Request type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
    }
  }
}

class AuthMiddleware {
  // Middleware to verify Firebase token
  async decodeToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized - No token provided" });
        return; // Stop further processing
      }

      const token = authHeader.split(" ")[1];
      const decodedValue = await admin.auth().verifyIdToken(token);

      if (!decodedValue) {
        res.status(403).json({ error: "Unauthorized - Invalid token" });
        return; // Stop further processing
      }

      req.user = decodedValue; // Attach decoded token data to the request
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Error decoding token:", error); // Log the error for debugging
      res.status(500).json({ error: "Internal Server Error", details: error });
    }
  }

  // Middleware to check if user is an admin
  isAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized - No user found" });
      return; // Stop further processing
    }

    if (req.user.role !== "admin") {
      res.status(403).json({ error: "Forbidden - Admins only" });
      return; // Stop further processing
    }

    next(); // Proceed to the next middleware or route handler
  }
}

export default new AuthMiddleware();