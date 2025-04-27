import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Campaign, Donation, User } from "@shared/schema";
import { DonationForm } from "@/components/donation/donation-form";
import { ProgressBar } from "@/components/campaign/progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategoryColor, formatCurrency, getTimeAgo, getProfileImageUrl } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Heart, Share2, Award, Clock, Calendar, User as UserIcon } from "lucide-react";

export default function CampaignDetails() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const campaignId = Number(id);

  // Fetch campaign details
  const { data: campaign, isLoading: isCampaignLoading } = useQuery<Campaign>({
    queryKey: [`/api/campaigns/${campaignId}`],
    enabled: !isNaN(campaignId)
  });

  // Fetch campaign creator
  const { data: creator, isLoading: isCreatorLoading } = useQuery<User>({
    queryKey: [`/api/users/${campaign?.creatorId}`],
    enabled: !!campaign?.creatorId
  });

  // Fetch donations for the campaign
  const { data: donations, isLoading: isDonationsLoading } = useQuery<Donation[]>({
    queryKey: [`/api/donations/campaign/${campaignId}`],
    enabled: !isNaN(campaignId)
  });

  // Handle when invalid campaign id is provided
  if (!isNaN(campaignId) && !isCampaignLoading && !campaign) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
        <p className="text-gray-600 mb-8">The campaign you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => setLocation("/campaigns")}>Browse All Campaigns</Button>
      </div>
    );
  }

  if (isCampaignLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-96 w-full rounded-xl mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  const { bgColor, textColor } = getCategoryColor(campaign.category);
  const donationsCount = donations?.length || 0;
  const uniqueDonorsCount = donations ? new Set(donations.map(d => d.donorId)).size : 0;
  const daysLeft = campaign.endDate 
    ? Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))
    : null;

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative mb-4">
            <img 
              src={campaign.imageUrl || "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=800&h=450"} 
              alt={campaign.title} 
              className="w-full rounded-xl object-cover h-80"
            />
            <div className={`absolute top-4 left-4 ${bgColor} ${textColor} text-xs font-bold px-2 py-1 rounded-full`}>
              {campaign.category}
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>

          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {isCreatorLoading ? (
                <Skeleton className="h-8 w-8 rounded-full mr-2" />
              ) : (
                <img 
                  src={creator?.avatarUrl || getProfileImageUrl(creator?.id || 0)} 
                  alt={creator?.fullName} 
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
              )}
              <span className="text-sm text-gray-600">
                by <span className="font-medium">{isCreatorLoading ? <Skeleton className="h-4 w-20 inline-block" /> : creator?.fullName}</span>
              </span>
            </div>
            <span className="mx-3 text-gray-300">•</span>
            <span className="text-sm text-gray-600">
              {campaign.createdAt ? getTimeAgo(campaign.createdAt) : ""}
            </span>
          </div>

          <Tabs defaultValue="about" className="mb-8">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
              <TabsTrigger value="donors">Donors ({donationsCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-4">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{campaign.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="updates" className="mt-4">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium mb-2">No updates yet</h3>
                <p className="text-gray-600">
                  The campaign organizer hasn't posted any updates yet. Check back later for news on this campaign's progress.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="donors" className="mt-4">
              {isDonationsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <Skeleton className="h-10 w-10 rounded-full mr-4" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-40 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              ) : donations?.length ? (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div key={donation.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={getProfileImageUrl(donation.donorId)} 
                        alt="Donor" 
                        className="w-10 h-10 rounded-full mr-4 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">
                          {donation.isAnonymous ? "Anonymous Donor" : `Donor #${donation.donorId}`}
                        </p>
                        <p className="text-sm text-gray-600">{getTimeAgo(donation.createdAt)}</p>
                      </div>
                      <span className="font-medium text-primary-500">{formatCurrency(donation.amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">No donations yet</h3>
                  <p className="text-gray-600">Be the first to support this campaign!</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Heart size={16} /> Favorite
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 size={16} /> Share
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Supporters</p>
                  <p className="text-xl font-bold">{uniqueDonorsCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Donations</p>
                  <p className="text-xl font-bold">{donationsCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {daysLeft !== null ? "Days Left" : "No Deadline"}
                  </p>
                  <p className="text-xl font-bold">{daysLeft !== null ? daysLeft : "∞"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{formatCurrency(campaign.raisedAmount)} raised</span>
                  <span className="text-gray-500">of {formatCurrency(campaign.goal)} goal</span>
                </div>
                <ProgressBar 
                  value={(campaign.raisedAmount / campaign.goal) * 100} 
                  color={textColor.replace('text-', '')}
                />
              </div>

              {!isAuthenticated ? (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 text-center">
                  <p className="text-gray-700 mb-2">You need to be logged in to donate</p>
                  <Button 
                    onClick={() => document.getElementById('login-button')?.click()}
                    variant="default"
                    className="w-full"
                  >
                    Log In to Donate
                  </Button>
                </div>
              ) : (
                <DonationForm campaignId={campaign.id} />
              )}

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {campaign.endDate ? (
                    <>Campaign ends on {new Date(campaign.endDate).toLocaleDateString()}</>
                  ) : (
                    <>No end date specified</>
                  )}
                </div>
                {campaign.creatorId === user?.id && (
                  <Button variant="outline" className="w-full mt-4">
                    Edit Campaign
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
