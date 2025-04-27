import { Campaign } from "@shared/schema";
import { CampaignCard } from "./campaign-card";

interface CampaignGridProps {
  campaigns: Campaign[];
}

export function CampaignGrid({ campaigns }: CampaignGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
