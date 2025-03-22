
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ViewToggleProps {
  activeViewType: string;
  setActiveViewType: (value: string) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ activeViewType, setActiveViewType }) => {
  return (
    <Tabs value={activeViewType} onValueChange={setActiveViewType} className="w-auto">
      <TabsList className="grid w-[180px] grid-cols-2">
        <TabsTrigger value="grid">Card View</TabsTrigger>
        <TabsTrigger value="table">Table View</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
