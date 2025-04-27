import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateProgress(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  const progress = (raised / goal) * 100;
  return Math.min(progress, 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getTimeAgo(date: Date | string): string {
  const now = new Date();
  const pastDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
}

export function getCategoryColor(category: string): { bgColor: string; textColor: string } {
  switch (category.toLowerCase()) {
    case 'education':
      return { bgColor: 'bg-primary-100', textColor: 'text-primary-500' };
    case 'healthcare':
      return { bgColor: 'bg-green-100', textColor: 'text-green-500' };
    case 'community':
      return { bgColor: 'bg-blue-100', textColor: 'text-blue-500' };
    case 'disaster relief':
      return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-500' };
    case 'arts & culture':
      return { bgColor: 'bg-purple-100', textColor: 'text-purple-500' };
    case 'animal welfare':
      return { bgColor: 'bg-pink-100', textColor: 'text-pink-500' };
    default:
      return { bgColor: 'bg-gray-100', textColor: 'text-gray-500' };
  }
}

// Generate avatar placeholder with initials
export function getInitials(name: string): string {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

// Get a random avatar URL from a set of predefined avatars
export function getRandomAvatarUrl(userId?: number): string {
  const avatarId = userId ? (userId % 10) + 1 : Math.floor(Math.random() * 10) + 1;
  return `https://randomuser.me/api/portraits/men/${avatarId}.jpg`;
}

// Default campaign image URLs
export const defaultCampaignImages = [
  'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=800&h=450',
  'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&h=450',
  'https://images.unsplash.com/photo-1551887373-3c5bd224f6e2?auto=format&fit=crop&w=800&h=450',
  'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&w=800&h=450',
  'https://images.unsplash.com/photo-1518736346526-f26ac536bd3b?auto=format&fit=crop&w=800&h=450',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&h=450',
];

// Get a campaign image URL based on category or random if not specified
export function getCampaignImageUrl(category?: string, index?: number): string {
  const idx = index !== undefined ? index % defaultCampaignImages.length : Math.floor(Math.random() * defaultCampaignImages.length);
  return defaultCampaignImages[idx];
}

// Default donor profile image URLs
export const defaultProfileImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150', // female
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150', // male
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150', // male
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150', // female
];

export function getProfileImageUrl(index?: number): string {
  const idx = index !== undefined ? index % defaultProfileImages.length : Math.floor(Math.random() * defaultProfileImages.length);
  return defaultProfileImages[idx];
}
