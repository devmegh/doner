import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCampaignSchema, insertDonationSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // All API routes are prefixed with /api
  
  // User routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      
      // Set user in session (simple auth)
      if (req.session) {
        req.session.userId = user.id;
      }
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const user = await storage.authenticate(credentials);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      
      // Set user in session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid credentials", errors: error.errors });
      }
      return res.status(500).json({ message: "Login failed" });
    }
  });
  
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logged out successfully" });
      });
    } else {
      return res.status(200).json({ message: "Already logged out" });
    }
  });
  
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get user" });
    }
  });
  
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get user" });
    }
  });
  
  // Campaign routes
  app.get("/api/campaigns", async (_req: Request, res: Response) => {
    try {
      const campaigns = await storage.getAllCampaigns();
      return res.status(200).json(campaigns);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get campaigns" });
    }
  });
  
  app.get("/api/campaigns/:id", async (req: Request, res: Response) => {
    try {
      const campaignId = parseInt(req.params.id);
      if (isNaN(campaignId)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }
      
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      return res.status(200).json(campaign);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get campaign" });
    }
  });
  
  app.get("/api/campaigns/category/:category", async (req: Request, res: Response) => {
    try {
      const category = req.params.category;
      const campaigns = await storage.getCampaignsByCategory(category);
      return res.status(200).json(campaigns);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get campaigns by category" });
    }
  });
  
  app.get("/api/campaigns/creator/:creatorId", async (req: Request, res: Response) => {
    try {
      const creatorId = parseInt(req.params.creatorId);
      if (isNaN(creatorId)) {
        return res.status(400).json({ message: "Invalid creator ID" });
      }
      
      const campaigns = await storage.getCampaignsByCreator(creatorId);
      return res.status(200).json(campaigns);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get campaigns by creator" });
    }
  });
  
  app.post("/api/campaigns", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const campaignData = insertCampaignSchema.parse({
        ...req.body,
        creatorId: req.session.userId
      });
      
      const campaign = await storage.createCampaign(campaignData);
      return res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid campaign data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create campaign" });
    }
  });
  
  app.patch("/api/campaigns/:id", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const campaignId = parseInt(req.params.id);
      if (isNaN(campaignId)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }
      
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Check if user is the creator of the campaign
      if (campaign.creatorId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to update this campaign" });
      }
      
      const updatedCampaign = await storage.updateCampaign(campaignId, req.body);
      return res.status(200).json(updatedCampaign);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update campaign" });
    }
  });
  
  app.delete("/api/campaigns/:id", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const campaignId = parseInt(req.params.id);
      if (isNaN(campaignId)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }
      
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Check if user is the creator of the campaign
      if (campaign.creatorId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized to delete this campaign" });
      }
      
      await storage.deleteCampaign(campaignId);
      return res.status(200).json({ message: "Campaign deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete campaign" });
    }
  });
  
  // Donation routes
  app.get("/api/donations/campaign/:campaignId", async (req: Request, res: Response) => {
    try {
      const campaignId = parseInt(req.params.campaignId);
      if (isNaN(campaignId)) {
        return res.status(400).json({ message: "Invalid campaign ID" });
      }
      
      const donations = await storage.getDonationsByCampaign(campaignId);
      return res.status(200).json(donations);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get campaign donations" });
    }
  });
  
  app.get("/api/donations/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Check if requesting own donations or has permission
      if (req.session && req.session.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to view these donations" });
      }
      
      const donations = await storage.getDonationsByUser(userId);
      return res.status(200).json(donations);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get user donations" });
    }
  });
  
  app.post("/api/donations", async (req: Request, res: Response) => {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const donationData = insertDonationSchema.parse({
        ...req.body,
        donorId: req.session.userId
      });
      
      // Check if campaign exists
      const campaign = await storage.getCampaign(donationData.campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Check if campaign is active
      if (!campaign.isActive) {
        return res.status(400).json({ message: "Campaign is not active" });
      }
      
      const donation = await storage.createDonation(donationData);
      return res.status(201).json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid donation data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create donation" });
    }
  });
  
  // Category routes
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ message: "Failed to get categories" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
