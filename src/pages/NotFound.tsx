
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-float-bg p-4">
      <motion.div 
        className="max-w-md w-full float-card p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-float-primary to-float-accent">
            404
          </div>
        </motion.div>
        
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-float-text-secondary mb-8">
          The thought you're looking for appears to have drifted beyond our current knowledge universe.
        </p>
        
        <Button asChild className="float-button float-button-primary">
          <a href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Your Universe
          </a>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
