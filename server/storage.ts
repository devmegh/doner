import { 
  User, InsertUser, Campaign, InsertCampaign, 
  Donation, InsertDonation, Category, InsertCategory,
  LoginCredentials, users, campaigns, donations, categories
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface defining all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Campaign operations
  getCampaign(id: number): Promise<Campaign | undefined>;
  getAllCampaigns(): Promise<Campaign[]>;
  getCampaignsByCategory(category: string): Promise<Campaign[]>;
  getCampaignsByCreator(creatorId: number): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaignData: Partial<Campaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;
  
  // Donation operations
  getDonation(id: number): Promise<Donation | undefined>;
  getDonationsByCampaign(campaignId: number): Promise<Donation[]>;
  getDonationsByUser(userId: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  
  // Category operations
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Authentication
  authenticate(credentials: LoginCredentials): Promise<User | undefined>;
}

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  // Initialize database with seed data
  async initializeDatabase() {
    try {
      // Check if categories exist, if not, create them
      const existingCategories = await db.select().from(categories);
      
      if (existingCategories.length === 0) {
        console.log('Initializing database with default categories');
        const defaultCategories: InsertCategory[] = [
          { 
            name: "Education", 
            iconName: "graduation-cap", 
            backgroundColor: "bg-primary-100", 
            textColor: "text-primary-500" 
          },
          { 
            name: "Healthcare", 
            iconName: "heart", 
            backgroundColor: "bg-green-100", 
            textColor: "text-green-500" 
          },
          { 
            name: "Community", 
            iconName: "users", 
            backgroundColor: "bg-blue-100", 
            textColor: "text-blue-500" 
          },
          { 
            name: "Disaster Relief", 
            iconName: "gift", 
            backgroundColor: "bg-yellow-100", 
            textColor: "text-yellow-500" 
          },
          { 
            name: "Arts & Culture", 
            iconName: "paint-brush", 
            backgroundColor: "bg-purple-100", 
            textColor: "text-purple-500" 
          },
          { 
            name: "Animal Welfare", 
            iconName: "heart", 
            backgroundColor: "bg-pink-100", 
            textColor: "text-pink-500" 
          }
        ];
        
        for (const category of defaultCategories) {
          await this.createCategory(category);
        }
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        donationCount: 0,
        totalDonated: 0
      })
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Campaign operations
  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id));
    return campaign;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns);
  }

  async getCampaignsByCategory(category: string): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.category, category));
  }

  async getCampaignsByCreator(creatorId: number): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.creatorId, creatorId));
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db
      .insert(campaigns)
      .values({
        ...insertCampaign,
        raisedAmount: 0
      })
      .returning();
    return campaign;
  }

  async updateCampaign(id: number, campaignData: Partial<Campaign>): Promise<Campaign | undefined> {
    const [updatedCampaign] = await db
      .update(campaigns)
      .set(campaignData)
      .where(eq(campaigns.id, id))
      .returning();
    return updatedCampaign;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    const result = await db
      .delete(campaigns)
      .where(eq(campaigns.id, id));
    return result.rowCount > 0;
  }

  // Donation operations
  async getDonation(id: number): Promise<Donation | undefined> {
    const [donation] = await db
      .select()
      .from(donations)
      .where(eq(donations.id, id));
    return donation;
  }

  async getDonationsByCampaign(campaignId: number): Promise<Donation[]> {
    return await db
      .select()
      .from(donations)
      .where(eq(donations.campaignId, campaignId))
      .orderBy(desc(donations.createdAt));
  }

  async getDonationsByUser(userId: number): Promise<Donation[]> {
    return await db
      .select()
      .from(donations)
      .where(eq(donations.donorId, userId))
      .orderBy(desc(donations.createdAt));
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    // Insert the donation
    const [donation] = await db
      .insert(donations)
      .values(insertDonation)
      .returning();
    
    // Update campaign raised amount
    const campaign = await this.getCampaign(donation.campaignId);
    if (campaign) {
      const updatedRaisedAmount = campaign.raisedAmount + donation.amount;
      await this.updateCampaign(campaign.id, { raisedAmount: updatedRaisedAmount });
    }
    
    // Update user donation stats
    const user = await this.getUser(donation.donorId);
    if (user) {
      const updatedDonationCount = user.donationCount + 1;
      const updatedTotalDonated = user.totalDonated + donation.amount;
      await this.updateUser(user.id, { 
        donationCount: updatedDonationCount, 
        totalDonated: updatedTotalDonated 
      });
    }
    
    return donation;
  }

  // Category operations
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return category;
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name));
    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  // Authentication
  async authenticate(credentials: LoginCredentials): Promise<User | undefined> {
    const { username, password } = credentials;
    const [user] = await db
      .select()
      .from(users)
      .where(and(
        eq(users.username, username),
        eq(users.password, password)
      ));
    
    return user;
  }
}

export const storage = new DatabaseStorage();

// Initialize the database with seed data
(async () => {
  try {
    await storage.initializeDatabase();
    console.log('Database initialized with seed data if needed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
})();
