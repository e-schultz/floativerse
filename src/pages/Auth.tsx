
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  
  // If user is already logged in, redirect to recent notes
  if (session) {
    return <Navigate to="/recent-notes" replace />;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !username) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Welcome to Float! You can now sign in."
      });
      
    } catch (error: any) {
      toast({
        title: "Error creating account",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter your email and password",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-float-bg p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-float-border shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">FLOAT</CardTitle>
            <CardDescription>
              Your personal knowledge management system
            </CardDescription>
          </CardHeader>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full float-button float-button-primary"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full float-button float-button-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
