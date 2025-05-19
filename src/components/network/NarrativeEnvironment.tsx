
import { useState } from "react";
import { useNetworkNarrativeAnalysis } from "@/hooks/twitter/use-network-narrative-analysis";
import { useNetworkThemeAnalysis } from "@/hooks/twitter/use-network-theme-analysis";
import { NarrativeDistributionChart } from "./NarrativeDistributionChart";
import { SourceNarrativeBreakdown } from "./SourceNarrativeBreakdown";
import { NarrativeDetailList } from "./NarrativeDetailList";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InformationEnvironment } from "./InformationEnvironment";

interface NarrativeEnvironmentProps {
  userId: string;
}

export const NarrativeEnvironment = ({ userId }: NarrativeEnvironmentProps) => {
  const { data, isLoading, error } = useNetworkNarrativeAnalysis(userId);
  const { data: themeData } = useNetworkThemeAnalysis(userId);
  
  const [selectedNarrativeId, setSelectedNarrativeId] = useState<string | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"narratives" | "sources" | "themes">("narratives");

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
        <h3 className="text-lg font-medium text-red-500">Could not load narrative environment data</h3>
        <p className="mt-2 text-gray-500">
          There was an error loading the narrative analysis data for this user.
          Please try again later or select another user.
        </p>
      </div>
    );
  }

  // Find the selected narrative or source
  const selectedNarrative = data.byNarrative.find(narrative => narrative.narrativeId === selectedNarrativeId) || null;
  const selectedSource = data.bySource.find(source => source.sourceId === selectedSourceId) || null;
  
  // Handle theme selection
  const handleThemeSelect = (themeId: string | null) => {
    setSelectedThemeId(themeId);
    if (themeId) {
      // Clear narrative and source selection when selecting a theme
      setSelectedNarrativeId(null);
      setSelectedSourceId(null);
      // Switch to theme tab
      setActiveTab("themes");
    }
  };
  
  // Prepare data for pie chart
  const pieChartData = data.byNarrative.map(narrative => ({
    name: narrative.narrativeName,
    value: narrative.totalTweets,
    color: narrative.narrativeColor,
    id: narrative.narrativeId,
    themeColor: narrative.themeColor,
    themeName: narrative.themeName
  }));
  
  // Switch the active tab when selecting an item from the other category
  const handleNarrativeSelect = (narrativeId: string | null) => {
    setSelectedNarrativeId(narrativeId);
    if (narrativeId) {
      setActiveTab("narratives");
      // Clear source selection when selecting a narrative
      setSelectedSourceId(null);
    }
  };
  
  const handleSourceSelect = (sourceId: string | null) => {
    setSelectedSourceId(sourceId);
    if (sourceId) {
      setActiveTab("sources");
      // Clear narrative selection when selecting a source
      setSelectedNarrativeId(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Handle Narrative Environment</h2>
          <p className="text-sm text-gray-500">
            Analyzing {data.totalNarratives} narratives across {data.totalSources} sources with {data.totalTweets} tweets
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NarrativeDistributionChart 
          data={pieChartData} 
          title="Narrative Distribution" 
          description="Volume of content by narrative"
          onNarrativeSelect={handleNarrativeSelect}
          selectedNarrativeId={selectedNarrativeId}
        />
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "narratives" | "sources" | "themes")}>
          <TabsList className="w-full">
            <TabsTrigger value="narratives" className="flex-1">By Narrative</TabsTrigger>
            <TabsTrigger value="sources" className="flex-1">By Source</TabsTrigger>
            {themeData && (
              <TabsTrigger value="themes" className="flex-1">By Theme</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="narratives">
            <SourceNarrativeBreakdown
              data={data.byNarrative}
              title="Top Narratives by Volume"
              mode="byNarrative"
              selectedId={selectedNarrativeId}
              onItemSelect={handleNarrativeSelect}
            />
          </TabsContent>
          
          <TabsContent value="sources">
            <SourceNarrativeBreakdown
              data={data.bySource}
              title="Top Sources by Volume"
              mode="bySource"
              selectedId={selectedSourceId}
              onItemSelect={handleSourceSelect}
            />
          </TabsContent>
          
          {themeData && (
            <TabsContent value="themes">
              <SourceNarrativeBreakdown
                data={themeData.byTheme}
                title="Top Themes by Volume"
                mode="byTheme"
                selectedId={selectedThemeId}
                onItemSelect={handleThemeSelect}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
      
      <div>
        {activeTab === "narratives" ? (
          <NarrativeDetailList
            title="Narrative Detail"
            data={selectedNarrative}
            viewMode="narrativeDetail"
            onItemClick={handleSourceSelect}
            onThemeClick={handleThemeSelect}
          />
        ) : activeTab === "sources" ? (
          <NarrativeDetailList
            title="Source Detail"
            data={selectedSource}
            viewMode="sourceDetail"
            onItemClick={handleNarrativeSelect}
            onThemeClick={handleThemeSelect}
          />
        ) : (
          <InformationEnvironment userId={userId} />
        )}
      </div>
    </div>
  );
};
