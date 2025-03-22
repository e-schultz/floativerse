
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, Plus, Star, Clock, Tag, Settings, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const FloatSidebar = ({ isOpen, setIsOpen }: FloatSidebarProps) => {
  const isMobile = useIsMobile();
  
  const sidebarVariants = {
    open: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    closed: { 
      x: isMobile ? "-100%" : "-10px", 
      opacity: isMobile ? 0 : 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: 20 }
  };

  const menuItems = [
    { icon: Star, label: 'Starred', path: '#starred' },
    { icon: Clock, label: 'Recent', path: '#recent' },
    { icon: Tag, label: 'Tags', path: '#tags' },
    { icon: Settings, label: 'Settings', path: '#settings' },
  ];

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}
      
      <motion.div
        className={cn(
          "h-screen fixed left-0 top-0 z-40 flex-shrink-0 border-r border-float-border",
          isMobile ? "w-64" : isOpen ? "w-64" : "w-16",
          "bg-white bg-opacity-90 backdrop-blur-sm"
        )}
        initial={isMobile ? "closed" : "open"}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center justify-between mb-6">
            <motion.div 
              variants={itemVariants}
              className={cn("font-semibold text-xl", !isOpen && !isMobile && "opacity-0")}
            >
              FLOAT
            </motion.div>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className={cn("rounded-full h-8 w-8", !isOpen && !isMobile && "mx-auto")}
              >
                {isOpen ? <X size={16} /> : <Menu size={16} />}
              </Button>
            )}
          </div>
          
          <div className={cn("relative mb-6", !isOpen && !isMobile && "opacity-0 invisible")}>
            <motion.div variants={itemVariants}>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="float-input w-full pl-9"
              />
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className={cn(
              "mb-6",
              !isOpen && !isMobile && "opacity-0 invisible"
            )}
          >
            <Button className="float-button float-button-primary w-full justify-center">
              <Plus className="mr-2 h-4 w-4" /> New Note
            </Button>
          </motion.div>
          
          <nav className="flex-1 space-y-1 overflow-auto">
            {menuItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.path}
                variants={itemVariants}
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md hover:bg-float-accent/10 transition-colors",
                  !isOpen && !isMobile && "justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5", isOpen || isMobile ? "mr-3" : "")} />
                <span className={cn(!isOpen && !isMobile && "hidden")}>
                  {item.label}
                </span>
              </motion.a>
            ))}
          </nav>
          
          <div className={cn(
            "mt-auto pt-4 border-t border-float-border",
            !isOpen && !isMobile && "opacity-0 invisible"
          )}>
            <motion.div 
              variants={itemVariants}
              className="flex items-center"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-float-primary to-float-accent mr-3" />
              <div>
                <div className="text-sm font-medium">User Name</div>
                <div className="text-xs text-float-text-secondary">Free Plan</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FloatSidebar;
