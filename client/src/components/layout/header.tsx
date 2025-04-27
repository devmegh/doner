import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/context/auth-context";
import { Menu, X, Heart, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [_, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<"login" | "signup">("login");
  const { user, isAuthenticated } = useAuth();

  // Check if page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [_]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleSearch = () => setIsSearchVisible(prev => !prev);

  const openAuthModal = (view: "login" | "signup") => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className={cn(
        "bg-white sticky top-0 z-50 transition-shadow duration-300",
        isScrolled ? "shadow-md" : "shadow-sm"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0 flex items-center">
                <Heart className="h-8 w-8 text-primary-500" />
                <span className="ml-2 text-xl font-bold text-gray-900">Donato</span>
              </a>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <a 
                  href="/" 
                  className={cn(
                    "font-medium px-1 pb-3 pt-4",
                    _ === "/" 
                      ? "text-primary-500 border-b-2 border-primary-500" 
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  Home
                </a>
                <a 
                  href="/campaigns" 
                  className={cn(
                    "font-medium px-1 pb-3 pt-4",
                    _ === "/campaigns" 
                      ? "text-primary-500 border-b-2 border-primary-500" 
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  Campaigns
                </a>
                <a 
                  href="/create-campaign" 
                  className={cn(
                    "font-medium px-1 pb-3 pt-4",
                    _ === "/create-campaign" 
                      ? "text-primary-500 border-b-2 border-primary-500" 
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  Start a Campaign
                </a>
                <a 
                  href="/about" 
                  className={cn(
                    "font-medium px-1 pb-3 pt-4",
                    _ === "/about" 
                      ? "text-primary-500 border-b-2 border-primary-500" 
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  About
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className={cn(
                "hidden md:block transition-all duration-300 ease-in-out",
                isSearchVisible ? "w-64" : "w-0 opacity-0"
              )}>
                {isSearchVisible && (
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Search campaigns..."
                      className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="hidden md:flex text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={toggleSearch}
                aria-label="Search"
              >
                {isSearchVisible ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
              
              {isAuthenticated ? (
                <div className="hidden md:block">
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 text-gray-700"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium text-sm">{user?.fullName?.split(' ')[0] || 'Profile'}</span>
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    id="login-button"
                    variant="ghost"
                    className="hidden md:block text-primary-600 font-medium border border-primary-500 px-4 py-2 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={() => openAuthModal("login")}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="default"
                    className="hidden md:block bg-primary-500 text-white font-medium px-4 py-2 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={() => openAuthModal("signup")}
                  >
                    Sign Up
                  </Button>
                </>
              )}
              
              <button 
                type="button" 
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <div className={cn("md:hidden", isMobileMenuOpen ? "block" : "hidden")}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a 
              href="/" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                _ === "/" ? "text-white bg-primary-500" : "text-gray-700 hover:bg-gray-100"
              )}
            >
              Home
            </a>
            <a 
              href="/campaigns" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                _ === "/campaigns" ? "text-white bg-primary-500" : "text-gray-700 hover:bg-gray-100"
              )}
            >
              Campaigns
            </a>
            <a 
              href="/create-campaign" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                _ === "/create-campaign" ? "text-white bg-primary-500" : "text-gray-700 hover:bg-gray-100"
              )}
            >
              Start a Campaign
            </a>
            <a 
              href="/about" 
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                _ === "/about" ? "text-white bg-primary-500" : "text-gray-700 hover:bg-gray-100"
              )}
            >
              About
            </a>
            
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="flex items-center px-5">
                  <Button 
                    className="w-full bg-primary-500 text-white font-medium px-4 py-2 rounded-lg"
                    onClick={() => navigate("/profile")}
                  >
                    View Profile
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center px-5">
                    <Button 
                      className="w-full bg-primary-500 text-white font-medium px-4 py-2 rounded-lg"
                      onClick={() => openAuthModal("signup")}
                    >
                      Sign Up
                    </Button>
                  </div>
                  <div className="mt-3 flex items-center px-5">
                    <Button 
                      variant="outline"
                      className="w-full bg-white text-primary-600 font-medium border border-primary-500 px-4 py-2 rounded-lg"
                      onClick={() => openAuthModal("login")}
                    >
                      Log In
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        view={authModalView}
        onViewChange={setAuthModalView}
      />
    </>
  );
}
