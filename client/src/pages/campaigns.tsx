import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Campaign, Category } from "@shared/schema";
import { CampaignGrid } from "@/components/campaign/campaign-grid";
import { CampaignFilters } from "@/components/campaign/campaign-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Campaigns() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Fetch all campaigns
  const { data: campaigns, isLoading: isCampaignsLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns']
  });

  // Fetch all categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });

  // Filter and sort campaigns
  const filteredAndSortedCampaigns = campaigns
    ? campaigns
        .filter(campaign => 
          (selectedCategory === "" || campaign.category === selectedCategory) &&
          (searchQuery === "" || 
            campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            campaign.description.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
          switch (sortOption) {
            case "newest":
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "most-funded":
              return b.raisedAmount - a.raisedAmount;
            case "least-funded":
              return a.raisedAmount - b.raisedAmount;
            case "target-amount":
              return b.goal - a.goal;
            case "progress":
              return (b.raisedAmount / b.goal) - (a.raisedAmount / a.goal);
            default:
              return 0;
          }
        })
    : [];

  const visibleCampaigns = filteredAndSortedCampaigns.slice(0, visibleCount);
  const hasMore = filteredAndSortedCampaigns.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(6); // Reset to initial page when searching
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(6); // Reset to initial page when changing category
  };

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
  };

  return (
    <div className="py-8 md:py-12">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Campaigns</h1>
          <p className="text-gray-600 max-w-3xl">
            Discover and support campaigns from around the world. Filter by category, 
            search for specific causes, or sort to find the campaigns that matter most to you.
          </p>
        </div>

        <CampaignFilters 
          categories={categories || []} 
          selectedCategory={selectedCategory}
          sortOption={sortOption}
          searchQuery={searchQuery}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onSearchChange={handleSearchQueryChange}
          isLoading={isCategoriesLoading}
        />

        {isCampaignsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-5 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `No results for "${searchQuery}". Try a different search term or browse all campaigns.` 
                : 'No campaigns match the selected filters. Try adjusting your filters or browse all campaigns.'}
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
              }}
            >
              View All Campaigns
            </Button>
          </div>
        ) : (
          <div className="mt-8">
            <CampaignGrid campaigns={visibleCampaigns} />
            
            {hasMore && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={handleLoadMore}
                  className="bg-white border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-50"
                  variant="outline"
                >
                  Load More Campaigns
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
