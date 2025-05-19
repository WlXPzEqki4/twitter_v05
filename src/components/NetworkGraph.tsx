
import { useState } from "react";
import { NetworkGraphContainer } from "./network/NetworkGraphContainer";
import { useNetworkFeed } from "./network/hooks/useNetworkFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InformationEnvironment } from "./network/InformationEnvironment";
import { NarrativeEnvironment } from "./network/NarrativeEnvironment";

interface NetworkGraphProps {
  userId: string;
}

export const NetworkGraph = ({ userId }: NetworkGraphProps) => {
  const { data, isLoading } = useNetworkFeed(userId);
  const [focusStartDate, setFocusStartDate] = useState<string | null>(null);
  const [focusEndDate, setFocusEndDate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"graph" | "themes" | "narratives">("graph");
  
  // Extract user colors from network feed data - this now uses our consistent color system
  const userColors = data?.userTweetCounts.reduce((colors, user) => {
    if (user.color) {
      colors[user.userId] = user.color;
    }
    return colors;
  }, {} as Record<string, string>) || {};

  const handleTimeRangeSelect = (start: string | null, end: string | null) => {
    setFocusStartDate(start);
    setFocusEndDate(end);
  };

  return (
    <div className="space-y-6 p-4">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "graph" | "themes" | "narratives")}>
        <TabsList className="mb-6">
          <TabsTrigger value="graph" className="px-4">Network Graph</TabsTrigger>
          <TabsTrigger value="themes" className="px-4">Themes Analysis</TabsTrigger>
          <TabsTrigger value="narratives" className="px-4">Narratives Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="graph">
          <NetworkGraphContainer 
            userId={userId} 
            userColors={userColors}
            onTimeRangeSelect={handleTimeRangeSelect}
          />
        </TabsContent>
        
        <TabsContent value="themes">
          <InformationEnvironment userId={userId} />
        </TabsContent>
        
        <TabsContent value="narratives">
          <NarrativeEnvironment userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

