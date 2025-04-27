import { Link } from "wouter";
import { Campaign } from "@shared/schema";
import { 
  formatCurrency, 
  calculateProgress, 
  truncateText,
  getCategoryColor,
  getProfileImageUrl
} from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = calculateProgress(campaign.raisedAmount, campaign.goal);
  const { bgColor, textColor } = getCategoryColor(campaign.category);
  
  // Default image if none provided
  const imageUrl = campaign.imageUrl || `https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=800&h=450`;
  
  return (
    <div className="campaign-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/campaigns/${campaign.id}`}>
        <div className="relative cursor-pointer">
          <img 
            src={imageUrl} 
            alt={campaign.title} 
            className="w-full h-48 object-cover"
          />
          <div className={`absolute top-4 left-4 ${bgColor} ${textColor} text-xs font-bold px-2 py-1 rounded-full`}>
            {campaign.category}
          </div>
        </div>
      </Link>
      
      <div className="p-5">
        <Link href={`/campaigns/${campaign.id}`}>
          <h3 className="text-lg font-bold mb-2 cursor-pointer hover:text-primary-500">
            {campaign.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4">
          {truncateText(campaign.description, 100)}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{formatCurrency(campaign.raisedAmount)} raised</span>
            <span className="text-gray-500">of {formatCurrency(campaign.goal)} goal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-${textColor.split('-')[1]}-500`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={getProfileImageUrl(campaign.creatorId)} 
              alt="Campaign creator" 
              className="w-8 h-8 rounded-full mr-2 object-cover"
            />
            <span className="text-sm text-gray-600">by <span className="font-medium">Creator #{campaign.creatorId}</span></span>
          </div>
          <Link href={`/campaigns/${campaign.id}`}>
            <Button 
              className={`bg-${textColor.split('-')[1]}-500 text-white hover:bg-${textColor.split('-')[1]}-600`}
              size="sm"
            >
              Donate
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
