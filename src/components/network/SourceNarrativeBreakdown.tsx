
import { NarrativeSourceData, SourceNarrativeData } from "@/hooks/twitter/use-network-narrative-analysis";
import { ThemeSourceData, SourceThemeData } from "@/hooks/twitter/use-network-theme-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SourceNarrativeBreakdownProps {
  data: NarrativeSourceData[] | SourceNarrativeData[] | ThemeSourceData[] | SourceThemeData[];
  title: string;
  mode: "byNarrative" | "bySource" | "byTheme";
  selectedId: string | null;
  onItemSelect: (id: string | null) => void;
}

export const SourceNarrativeBreakdown = ({
  data,
  title,
  mode,
  selectedId,
  onItemSelect,
}: SourceNarrativeBreakdownProps) => {
  // Determine what property to display in the list
  const getDisplayName = (item: any) => {
    if (mode === "byNarrative") {
      return item.narrativeName;
    } else if (mode === "byTheme") {
      return item.themeName;
    } else {
      return item.displayName || item.username;
    }
  };

  // Determine what property to use for the color
  const getColor = (item: any) => {
    if (mode === "byNarrative") {
      return item.narrativeColor;
    } else if (mode === "byTheme") {
      return item.themeColor;
    } else {
      // For sources, we don't have a color property
      return "#6E5494";
    }
  };

  // Determine what property to use for the ID
  const getId = (item: any) => {
    if (mode === "byNarrative") {
      return item.narrativeId;
    } else if (mode === "byTheme") {
      return item.themeId;
    } else {
      return item.sourceId;
    }
  };

  // Calculate the maximum tweet count to determine bar widths
  const maxTweets = Math.max(...data.map(item => item.totalTweets || 0));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 px-6">
          <div className="space-y-4">
            {data.map((item: any) => {
              const id = getId(item);
              const isSelected = selectedId === id;
              const barWidth = (item.totalTweets / maxTweets) * 100;
              
              return (
                <div 
                  key={id} 
                  className={`group cursor-pointer ${isSelected ? 'bg-gray-50' : ''}`}
                  onClick={() => onItemSelect(isSelected ? null : id)}
                >
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {(mode === "byNarrative" || mode === "byTheme") && (
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getColor(item) }}
                        />
                      )}
                      <span className={`text-sm font-medium ${isSelected ? 'text-black' : ''}`}>
                        {getDisplayName(item)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{item.totalTweets} tweets</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${barWidth}%`, 
                        backgroundColor: getColor(item),
                        opacity: isSelected ? 1 : 0.7
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
