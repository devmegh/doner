import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const [_, navigate] = useLocation();
  
  return (
    <section className="bg-primary-50 py-10 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Make a difference with your donation today
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl">
              Join thousands of people supporting campaigns that matter. Every donation counts, no matter how small.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-primary-500 text-white font-medium px-6 py-3 rounded-lg text-lg hover:bg-primary-600"
                onClick={() => navigate("/campaigns")}
              >
                Explore Campaigns
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white text-primary-600 font-medium border border-primary-500 px-6 py-3 rounded-lg text-lg hover:bg-primary-50"
                onClick={() => navigate("/create-campaign")}
              >
                Start a Campaign
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&h=600" 
              alt="People volunteering together" 
              className="rounded-lg shadow-xl"
              width="800"
              height="600"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
