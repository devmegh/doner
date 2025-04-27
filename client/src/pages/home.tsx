import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/category/category-grid";
import { CampaignGrid } from "@/components/campaign/campaign-grid";
import { ImpactSection } from "@/components/home/impact-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { Newsletter } from "@/components/home/newsletter";
import { useQuery } from "@tanstack/react-query";
import { Campaign, Category } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featuredCampaigns, isLoading: isFeaturedLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
    select: (campaigns) => campaigns.slice(0, 3)
  });

  const { data: recentCampaigns, isLoading: isRecentLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
    select: (campaigns) => {
      const sorted = [...campaigns].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return sorted.slice(0, 3);
    }
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });

  return (
    <>
      <HeroSection />

      <section className="py-10 lg:py-14">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Explore by Category</h2>
          {isCategoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center p-4">
                  <Skeleton className="w-12 h-12 rounded-full mb-3" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <CategoryGrid categories={categories || []} />
          )}
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Campaigns</h2>
            <a href="/campaigns" className="text-primary-500 font-medium hover:text-primary-600">View all</a>
          </div>
          {isFeaturedLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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
          ) : (
            <CampaignGrid campaigns={featuredCampaigns || []} />
          )}
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Recent Campaigns</h2>
            <a href="/campaigns" className="text-primary-500 font-medium hover:text-primary-600">View all</a>
          </div>
          {isRecentLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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
          ) : (
            <CampaignGrid campaigns={recentCampaigns || []} />
          )}
        </div>
      </section>

      <ImpactSection />
      <HowItWorks />
      <TestimonialsSection />
      <Newsletter />
    </>
  );
}
