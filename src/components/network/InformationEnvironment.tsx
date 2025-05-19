
import { useState } from "react";
import { useNetworkThemeAnalysis } from "@/hooks/twitter/use-network-theme-analysis";
import { ThemeDistributionChart } from "./ThemeDistributionChart";
import { SourceThemeBreakdown } from "./SourceThemeBreakdown";
import { ThemeDetailList } from "./ThemeDetailList";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InformationEnvironmentProps {
  userId: string;
}

export const InformationEnvironment = ({ userId }: InformationEnvironmentProps) => {
  const { data, isLoading, error } = useNetworkThemeAnalysis(userId);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"themes" | "sources">("themes");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h3 className="text-lg font-medium text-red-500">Could not load information environment data</h3>
        <p className="mt-2 text-gray-500">
          There was an error loading the theme analysis data for this user.
          Please try again later or select another user.
        </p>
      </div>
    );
  }

  // Find the selected theme or source
  const selectedTheme = data.byTheme.find(theme => theme.themeId === selectedThemeId) || null;
  const selectedSource = data.bySource.find(source => source.sourceId === selectedSourceId) || null;
  
  // Prepare data for pie chart
  const pieChartData = data.byTheme.map(theme => ({
    name: theme.themeName,
    value: theme.totalTweets,
    color: theme.themeColor,
    id: theme.themeId
  }));
  
  // Switch the active tab when selecting an item from the other category
  const handleThemeSelect = (themeId: string | null) => {
    setSelectedThemeId(themeId);
    if (themeId) {
      setActiveTab("themes");
      // Clear source selection when selecting a theme
      setSelectedSourceId(null);
    }
  };
  
  const handleSourceSelect = (sourceId: string | null) => {
    setSelectedSourceId(sourceId);
    if (sourceId) {
      setActiveTab("sources");
      // Clear theme selection when selecting a source
      setSelectedThemeId(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Handle Information Environment</h2>
          <p className="text-sm text-gray-500">
            Analyzing {data.totalThemes} themes across {data.totalSources} sources with {data.totalTweets} tweets
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ThemeDistributionChart 
          data={pieChartData} 
          title="Theme Distribution" 
          description="Volume of content by theme"
          onThemeSelect={handleThemeSelect}
          selectedThemeId={selectedThemeId}
        />
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "themes" | "sources")}>
          <TabsList className="w-full">
            <TabsTrigger value="themes" className="flex-1">By Theme</TabsTrigger>
            <TabsTrigger value="sources" className="flex-1">By Source</TabsTrigger>
          </TabsList>
          
          <TabsContent value="themes">
            <SourceThemeBreakdown
              data={data.byTheme}
              title="Top Themes by Volume"
              mode="byTheme"
              selectedId={selectedThemeId}
              onItemSelect={handleThemeSelect}
            />
          </TabsContent>
          
          <TabsContent value="sources">
            <SourceThemeBreakdown
              data={data.bySource}
              title="Top Sources by Volume"
              mode="bySource"
              selectedId={selectedSourceId}
              onItemSelect={handleSourceSelect}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <div>
        {activeTab === "themes" ? (
          <ThemeDetailList
            title="Theme Detail"
            data={selectedTheme}
            viewMode="themeDetail"
            onItemClick={handleSourceSelect}
          />
        ) : (
          <ThemeDetailList
            title="Source Detail"
            data={selectedSource}
            viewMode="sourceDetail"
            onItemClick={handleThemeSelect}
          />
        )}
      </div>
    </div>
  );
};
