import { Button } from "@/components/ui/button";
import { Heart, Award, Users, BarChart4, MessageSquare, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="container py-8 md:py-12">
      <section className="max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">About Donato</h1>
        <p className="text-xl text-gray-600 text-center">
          Donato is a platform connecting donors with campaigns that make a real difference in the world.
        </p>
      </section>

      <section className="mb-16">
        <div className="bg-primary-50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                We believe that giving should be simple, transparent, and impactful. Our mission is to 
                create a world where anyone can easily support causes they care about and see the 
                real impact of their generosity.
              </p>
              <p className="text-gray-600">
                Since our founding, we've helped thousands of campaigns raise millions of dollars for 
                causes ranging from education and healthcare to disaster relief and community development.
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&h=600" 
                alt="People volunteering together" 
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Donato</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Trusted Platform</h3>
            <p className="text-gray-600">
              We vet all campaigns to ensure legitimacy and maintain the highest standards 
              of trust and transparency.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <BarChart4 className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real Impact Tracking</h3>
            <p className="text-gray-600">
              See exactly how your donations are making a difference with detailed 
              progress tracking and updates.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Global Reach</h3>
            <p className="text-gray-600">
              Support campaigns from around the world and connect with causes 
              that resonate with your values.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            We're a passionate group of individuals dedicated to building technology 
            that makes giving easier and more impactful.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150" 
                alt="Sarah Johnson" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-bold">Sarah Johnson</h3>
              <p className="text-gray-600 text-sm">Founder & CEO</p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150" 
                alt="Michael Chen" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-bold">Michael Chen</h3>
              <p className="text-gray-600 text-sm">CTO</p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150" 
                alt="Maria Rodriguez" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-bold">Maria Rodriguez</h3>
              <p className="text-gray-600 text-sm">Head of Partnerships</p>
            </div>
            
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150" 
                alt="James Wilson" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-bold">James Wilson</h3>
              <p className="text-gray-600 text-sm">Head of Community</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">What We Value</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-primary-500" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Transparency</h3>
              <p className="text-gray-600">
                We believe in complete transparency in all our operations. Donors can see exactly 
                where their money goes, and campaign creators are required to provide regular updates.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-gray-600">
                We're building a global community of givers and changemakers who support each 
                other in creating positive impact in the world.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Connection</h3>
              <p className="text-gray-600">
                We connect donors directly with the people and causes they support, 
                creating meaningful relationships that go beyond just financial giving.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Global Impact</h3>
              <p className="text-gray-600">
                We're committed to facilitating positive change around the world, 
                regardless of borders, backgrounds, or beliefs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-lg text-gray-600 mb-8">
          Join thousands of donors and campaign creators who are changing the world, one donation at a time.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            onClick={() => window.location.href = "/campaigns"}
          >
            Browse Campaigns
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => window.location.href = "/create-campaign"}
          >
            Start a Campaign
          </Button>
        </div>
      </section>
    </div>
  );
}
