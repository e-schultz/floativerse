
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const { session } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-float-bg text-float-text">
      <header className="p-4 flex justify-between items-center border-b border-float-border">
        <div className="text-xl font-bold">FLOAT</div>
        {session ? (
          <Link to="/recent-notes">
            <Button>Go to Dashboard</Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button>Sign In</Button>
          </Link>
        )}
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">FLOAT</h1>
        <p className="text-xl mb-8 max-w-2xl">
          Your personal knowledge management system. Capture, connect, and explore your thoughts with ease.
        </p>
        {session ? (
          <div className="space-x-4">
            <Link to="/recent-notes">
              <Button className="float-button float-button-primary">Go to Dashboard</Button>
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link to="/auth">
              <Button className="float-button float-button-primary">Get Started</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
