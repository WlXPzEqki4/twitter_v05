
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkTimeSeries } from "./NetworkTimeSeries";
import { NetworkTweetDistribution } from "./NetworkTweetDistribution";
import { useNetworkFeed } from "./hooks/useNetworkFeed";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { BarChart2, LineChart } from "lucide-react";

interface NetworkTimelineContainerProps {
  userId: string;
  timeRange?: number;
  userColors?: Record<string, string>;
  onTimeRangeSelect?: (start: string, end: string) => void;
}

export const NetworkTimelineContainer = ({
  userId,
  timeRange = 30,
  userColors = {},
  onTimeRangeSelect
}: NetworkTimelineContainerProps) => {
  const [focusStartDate, setFocusStartDate] = useState<string | null>(null);
  const [focusEndDate, setFocusEndDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"line" | "stackedBar">("line");
  
  const { data, isLoading, error } = useNetworkFeed(userId, timeRange);
  
  const handleTimeRangeSelect = (start: string, end: string) => {
    setFocusStartDate(start);
    setFocusEndDate(end);
    
    // Pass the selected time range up to the parent component if the callback exists
    if (onTimeRangeSelect) {
      onTimeRangeSelect(start, end);
    }
  };
  
  const filteredData = data?.dailyTweets.filter(day => {
    if (!focusStartDate || !focusEndDate) return true;
    return day.date >= focusStartDate && day.date <= focusEndDate;
  });
  
  // Create a mapping of user IDs to colors from our feed data
  const feedUserColors = data?.userTweetCounts.reduce((colors, user) => {
    if (user.color) {
      // Use color from our unified color system
      colors[user.userId] = user.color;
    }
    return colors;
  }, {} as Record<string, string>) || {};
  
  // Combine passed-in userColors with ones from our feed data
  // Using spread to ensure passed-in colors take precedence
  const combinedUserColors = { ...feedUserColors, ...userColors };
  
  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg mt-6">
        <h3 className="font-medium text-red-800">Error loading network timeline</h3>
        <p className="text-red-600 text-sm">{error.message}</p>
      </div>
    );
  }
  
  if (!data || data.dailyTweets.length === 0) {
    return (
      <div className="bg-amber-50 p-4 rounded-lg mt-6">
        <h3 className="font-medium text-amber-800">No timeline data available</h3>
        <p className="text-amber-600 text-sm">There are no tweets in this user's network for the selected time period.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Network Activity Timeline</CardTitle>
            <div className="flex items-center gap-2">
              <LineChart size={18} className={viewMode === "line" ? "text-purple-800" : "text-gray-400"} />
              <Switch 
                checked={viewMode === "stackedBar"} 
                onCheckedChange={(checked) => setViewMode(checked ? "stackedBar" : "line")}
              />
              <BarChart2 size={18} className={viewMode === "stackedBar" ? "text-purple-800" : "text-gray-400"} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <NetworkTimeSeries 
            data={data.dailyTweets} 
            onTimeRangeSelect={handleTimeRangeSelect}
            viewMode={viewMode}
            userColors={combinedUserColors}
            userData={data.userTweetCounts}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Tweet Distribution by Network Member</CardTitle>
        </CardHeader>
        <CardContent>
          <NetworkTweetDistribution 
            userData={data.userTweetCounts} 
            focusStartDate={focusStartDate}
            focusEndDate={focusEndDate}
          />
        </CardContent>
      </Card>
    </div>
  );
};
