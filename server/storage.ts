import { 
  User, InsertUser, Campaign, InsertCampaign, 
  Donation, InsertDonation, Category, InsertCategory,
  LoginCredentials
} from "@shared/schema";

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

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaigns: Map<number, Campaign>;
  private donations: Map<number, Donation>;
  private categories: Map<number, Category>;
  private userIdCounter: number;
  private campaignIdCounter: number;
  private donationIdCounter: number;
  private categoryIdCounter: number;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.donations = new Map();
    this.categories = new Map();
    this.userIdCounter = 1;
    this.campaignIdCounter = 1;
    this.donationIdCounter = 1;
    this.categoryIdCounter = 1;
    
    // Initialize with some default categories
    this.initializeCategories();
  }

  private initializeCategories() {
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

    defaultCategories.forEach(category => {
      this.createCategory(category);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      donationCount: 0, 
      totalDonated: 0, 
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Campaign operations
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaignsByCategory(category: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(
      (campaign) => campaign.category === category
    );
  }

  async getCampaignsByCreator(creatorId: number): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(
      (campaign) => campaign.creatorId === creatorId
    );
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.campaignIdCounter++;
    const now = new Date();
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      raisedAmount: 0,
      createdAt: now
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, campaignData: Partial<Campaign>): Promise<Campaign | undefined> {
    const existingCampaign = await this.getCampaign(id);
    if (!existingCampaign) return undefined;
    
    const updatedCampaign = { ...existingCampaign, ...campaignData };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }

  // Donation operations
  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async getDonationsByCampaign(campaignId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      (donation) => donation.campaignId === campaignId
    );
  }

  async getDonationsByUser(userId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      (donation) => donation.donorId === userId
    );
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.donationIdCounter++;
    const now = new Date();
    const donation: Donation = {
      ...insertDonation,
      id,
      createdAt: now
    };
    this.donations.set(id, donation);
    
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
    return this.categories.get(id);
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
  }

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const now = new Date();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: now
    };
    this.categories.set(id, category);
    return category;
  }

  // Authentication
  async authenticate(credentials: LoginCredentials): Promise<User | undefined> {
    const user = await this.getUserByUsername(credentials.username);
    if (!user) return undefined;
    
    // Simple password check (in a real app would use bcrypt)
    if (user.password === credentials.password) {
      return user;
    }
    
    return undefined;
  }
}

export const storage = new MemStorage();
