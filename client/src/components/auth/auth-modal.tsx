import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { useAuth } from "@/context/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  view: "login" | "signup";
  onViewChange: (view: "login" | "signup") => void;
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  view, 
  onViewChange 
}: AuthModalProps) {
  const { refreshUser } = useAuth();

  const handleSuccess = () => {
    refreshUser();
    onClose();
  };

  const handleForgotPassword = () => {
    // This would be implemented in a production app
    console.log("Forgot password clicked");
  };

  const switchToLogin = () => onViewChange("login");
  const switchToSignup = () => onViewChange("signup");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <Tabs 
          value={view} 
          onValueChange={(value) => onViewChange(value as "login" | "signup")}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2 rounded-none">
            <TabsTrigger value="login" className="text-base">Log In</TabsTrigger>
            <TabsTrigger value="signup" className="text-base">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="m-0">
            <LoginForm 
              onSuccess={handleSuccess} 
              onForgotPassword={handleForgotPassword}
              onSwitchToSignup={switchToSignup}
            />
          </TabsContent>
          
          <TabsContent value="signup" className="m-0">
            <SignupForm 
              onSuccess={handleSuccess}
              onSwitchToLogin={switchToLogin}
            />
          </TabsContent>
        </Tabs>
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
