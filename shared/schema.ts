import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  role: text("role").default("donor").notNull(),
  donationCount: integer("donation_count").default(0).notNull(),
  totalDonated: doublePrecision("total_donated").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Campaign model
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  goal: doublePrecision("goal").notNull(),
  raisedAmount: doublePrecision("raised_amount").default(0).notNull(),
  creatorId: integer("creator_id").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Donation model
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: doublePrecision("amount").notNull(),
  campaignId: integer("campaign_id").notNull(),
  donorId: integer("donor_id").notNull(),
  message: text("message"),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Category model - for predefined campaign categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  iconName: text("icon_name").notNull(),
  backgroundColor: text("background_color").notNull(),
  textColor: text("text_color").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schemas for data insertion/validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true, 
  donationCount: true, 
  totalDonated: true,
  createdAt: true
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true, 
  raisedAmount: true, 
  createdAt: true
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true, 
  createdAt: true
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true
});

// Add login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Types for the models
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
