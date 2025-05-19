
import { NarrativeSourceData, SourceNarrativeData } from "@/hooks/twitter/use-network-narrative-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface NarrativeDetailListProps {
  title: string;
  data: NarrativeSourceData | SourceNarrativeData | null;
  viewMode: "narrativeDetail" | "sourceDetail";
  onItemClick?: (id: string) => void;
  onThemeClick?: (id: string) => void;
}

export const NarrativeDetailList = ({ 
  title, 
  data, 
  viewMode,
  onItemClick,
  onThemeClick
}: NarrativeDetailListProps) => {
  if (!data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
          Select an item to see details
        </CardContent>
      </Card>
    );
  }
  
  const items = viewMode === "narrativeDetail" 
    ? (data as NarrativeSourceData).sources
    : (data as SourceNarrativeData).narratives;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {viewMode === "narrativeDetail" 
            ? (
              <div className="flex flex-col gap-2">
                <span>{title}: {(data as NarrativeSourceData).narrativeName}</span>
                <div className="flex gap-2 items-center text-sm font-normal">
                  <Badge 
                    style={{ backgroundColor: (data as NarrativeSourceData).themeColor }} 
                    className="cursor-pointer"
                    onClick={() => onThemeClick && onThemeClick((data as NarrativeSourceData).themeId)}
                  >
                    {(data as NarrativeSourceData).themeName}
                  </Badge>
                  <span className="text-gray-500">Theme</span>
                </div>
              </div>
            ) 
            : title + ": " + ((data as SourceNarrativeData).displayName || (data as SourceNarrativeData).username)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={index}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onItemClick && onItemClick(viewMode === "narrativeDetail" ? item.sourceId : item.narrativeId)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    {viewMode === "narrativeDetail" ? (
                      <div className="font-medium">
                        {item.displayName || item.username}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.narrativeColor }}
                          />
                          <div className="font-medium">{item.narrativeName}</div>
                        </div>
                        <div className="mt-1 flex gap-2 items-center text-xs">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.themeColor }}
                          />
                          <div 
                            className="text-gray-500 underline cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation(); 
                              onThemeClick && onThemeClick(item.themeId);
                            }}
                          >
                            {item.themeName}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                    {item.tweetCount} tweets
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {viewMode === "narrativeDetail" ? (
                    <span>@{item.username}</span>
                  ) : (
                    <span>Relevance: {(item.relevanceScore * 100).toFixed(0)}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
