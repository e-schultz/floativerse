
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

const FloatHeaderActions = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully"
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" className="flex items-center">
        <UserIcon className="h-4 w-4 mr-2" />
        {user?.user_metadata?.username || user?.email || 'User'}
      </Button>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FloatHeaderActions;
