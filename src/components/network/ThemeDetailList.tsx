
import { ThemeSourceData, SourceThemeData } from "@/hooks/twitter/use-network-theme-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ThemeDetailListProps {
  title: string;
  data: ThemeSourceData | SourceThemeData | null;
  viewMode: "themeDetail" | "sourceDetail";
  onItemClick?: (id: string) => void;
}

export const ThemeDetailList = ({ 
  title, 
  data, 
  viewMode,
  onItemClick 
}: ThemeDetailListProps) => {
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
  
  const items = viewMode === "themeDetail" 
    ? (data as ThemeSourceData).sources
    : (data as SourceThemeData).themes;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {title}: {viewMode === "themeDetail" 
            ? (data as ThemeSourceData).themeName 
            : (data as SourceThemeData).displayName || (data as SourceThemeData).username}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div 
                key={index}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onItemClick && onItemClick(viewMode === "themeDetail" ? item.sourceId : item.themeId)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    {viewMode === "themeDetail" ? (
                      <div className="font-medium">
                        {item.displayName || item.username}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: item.themeColor }}
                        />
                        <div className="font-medium">{item.themeName}</div>
                      </div>
                    )}
                  </div>
                  <div className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                    {item.tweetCount} tweets
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {viewMode === "themeDetail" ? (
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
