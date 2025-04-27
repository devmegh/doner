import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Campaigns from "@/pages/campaigns";
import CampaignDetails from "@/pages/campaign-details";
import CreateCampaign from "@/pages/create-campaign";
import UserProfile from "@/pages/user-profile";
import About from "@/pages/about";
import { AuthProvider } from "@/context/auth-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/campaigns" component={Campaigns} />
          <Route path="/campaigns/:id" component={CampaignDetails} />
          <Route path="/create-campaign" component={CreateCampaign} />
          <Route path="/profile/:id?" component={UserProfile} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
