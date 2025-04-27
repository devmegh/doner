import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { User, Campaign, Donation } from "@shared/schema";
import { useAuth } from "@/context/auth-context";
import { CampaignCard } from "@/components/campaign/campaign-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, getProfileImageUrl } from "@/lib/utils";
import { Edit, LogOut, Award, Heart, Gift } from "lucide-react";

export default function UserProfile() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { user: currentUser, isAuthenticated, logout } = useAuth();
  
  // Determine if viewing own profile or someone else's
  const userId = id ? parseInt(id) : currentUser?.id;
  const isOwnProfile = userId === currentUser?.id;

  // Fetch user data
  const { data: user, isLoading: isUserLoading } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  // Fetch user's campaigns
  const { data: userCampaigns, isLoading: isCampaignsLoading } = useQuery<Campaign[]>({
    queryKey: [`/api/campaigns/creator/${userId}`],
    enabled: !!userId,
  });

  // Fetch user's donations
  const { data: userDonations, isLoading: isDonationsLoading } = useQuery<Donation[]>({
    queryKey: [`/api/donations/user/${userId}`],
    enabled: !!userId && isOwnProfile,
  });

  // Redirect if user is not found after loading
  if (!isUserLoading && !user) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">User Not Found</h1>
        <p className="text-gray-600 mb-8">The profile you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => setLocation("/")}>Return to Home</Button>
      </div>
    );
  }

  // Redirect if trying to view another user's donations
  if (!isUserLoading && !isOwnProfile && id && userId !== currentUser?.id) {
    setLocation(`/profile/${userId}`);
    return null;
  }

  // If user is not authenticated and tries to view a profile
  if (!isAuthenticated && !id) {
    return (
      <div className="container py-16 max-w-md mx-auto text-center">
        <Card>
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold mb-4">Login Required</h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your profile. Please log in or sign up to continue.
            </p>
            <Button 
              onClick={() => document.getElementById('login-button')?.click()}
              className="w-full"
            >
              Log In / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {/* Profile Card */}
          <Card className="sticky top-8">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                {isUserLoading ? (
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                ) : (
                  <img 
                    src={user?.avatarUrl || getProfileImageUrl(user?.id || 0)} 
                    alt={user?.fullName || "User"} 
                    className="h-24 w-24 rounded-full object-cover mb-4"
                  />
                )}
                
                {isUserLoading ? (
                  <>
                    <Skeleton className="h-7 w-40 mb-1" />
                    <Skeleton className="h-5 w-24 mb-6" />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{user?.fullName}</h2>
                    <p className="text-gray-500 mb-6">@{user?.username}</p>
                  </>
                )}

                {isOwnProfile && (
                  <div className="w-full space-y-3 mb-6">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Edit className="h-4 w-4" /> Edit Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 text-destructive border-destructive hover:bg-destructive/10"
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4" /> Log Out
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Donation Stats</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Gift className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Donated</p>
                      {isUserLoading ? (
                        <Skeleton className="h-6 w-20" />
                      ) : (
                        <p className="text-lg font-bold">{formatCurrency(user?.totalDonated || 0)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Campaigns Supported</p>
                      {isUserLoading || isDonationsLoading ? (
                        <Skeleton className="h-6 w-20" />
                      ) : (
                        <p className="text-lg font-bold">{user?.donationCount || 0}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Award className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Campaigns Created</p>
                      {isCampaignsLoading ? (
                        <Skeleton className="h-6 w-20" />
                      ) : (
                        <p className="text-lg font-bold">{userCampaigns?.length || 0}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="campaigns">
            <TabsList className="mb-6">
              <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
              {isOwnProfile && <TabsTrigger value="donations">My Donations</TabsTrigger>}
              {isOwnProfile && <TabsTrigger value="settings">Account Settings</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="campaigns">
              <h2 className="text-2xl font-bold mb-6">
                {isOwnProfile ? "My Campaigns" : `${user?.fullName}'s Campaigns`}
              </h2>
              
              {isCampaignsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(2)].map((_, i) => (
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
              ) : userCampaigns?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userCampaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      {isOwnProfile
                        ? "You haven't created any campaigns yet"
                        : `${user?.fullName} hasn't created any campaigns yet`}
                    </h3>
                    {isOwnProfile && (
                      <>
                        <p className="text-gray-600 mb-8">
                          Start raising funds for causes you care about by creating your first campaign.
                        </p>
                        <Button onClick={() => setLocation("/create-campaign")}>
                          Create a Campaign
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {isOwnProfile && userCampaigns?.length ? (
                <div className="mt-6 text-center">
                  <Button onClick={() => setLocation("/create-campaign")}>
                    Create New Campaign
                  </Button>
                </div>
              ) : null}
            </TabsContent>
            
            {isOwnProfile && (
              <TabsContent value="donations">
                <h2 className="text-2xl font-bold mb-6">My Donations</h2>
                
                {isDonationsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i}>
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Skeleton className="h-12 w-12 rounded-md" />
                              <div>
                                <Skeleton className="h-5 w-40 mb-1" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                            </div>
                            <Skeleton className="h-6 w-20" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : userDonations?.length ? (
                  <div className="space-y-4">
                    {userDonations.map((donation) => (
                      <Card key={donation.id}>
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary-100 rounded-md flex items-center justify-center">
                                <Gift className="h-6 w-6 text-primary-500" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Campaign #{donation.campaignId}</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(donation.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-primary-500">{formatCurrency(donation.amount)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        You haven't made any donations yet
                      </h3>
                      <p className="text-gray-600 mb-8">
                        Support causes you care about by making your first donation.
                      </p>
                      <Button onClick={() => setLocation("/campaigns")}>
                        Browse Campaigns
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}
            
            {isOwnProfile && (
              <TabsContent value="settings">
                <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      This feature is coming soon. You'll be able to update your profile information here.
                    </p>
                    <Button variant="outline" disabled>Edit Information</Button>
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Password & Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      This feature is coming soon. You'll be able to update your password and security settings here.
                    </p>
                    <Button variant="outline" disabled>Change Password</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      This feature is coming soon. You'll be able to manage your notification preferences here.
                    </p>
                    <Button variant="outline" disabled>Manage Notifications</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
