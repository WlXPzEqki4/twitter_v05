
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { UserTweetCount } from "./hooks/useNetworkFeed";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { TweetList } from "../TweetList";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { CHART_COLORS } from "@/hooks/twitter/use-color-palette";
import { connectionUsernames } from "@/hooks/twitter";

interface NetworkTweetDistributionProps {
  userData: UserTweetCount[];
  focusStartDate: string | null;
  focusEndDate: string | null;
}

export const NetworkTweetDistribution = ({
  userData,
  focusStartDate,
  focusEndDate
}: NetworkTweetDistributionProps) => {
  const [selectedUser, setSelectedUser] = useState<UserTweetCount | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Sort users by tweet count (descending)
  const sortedUsers = useMemo(() => {
    return [...userData].sort((a, b) => b.count - a.count);
  }, [userData]);
  
  // Display ALL users instead of just the top 10
  const displayUsers = useMemo(() => {
    return sortedUsers.map(user => ({
      name: user.name || user.username, // Prefer display name if available
      username: user.username,
      userId: user.userId,
      count: user.count,
      color: user.color // Use the consistent color from our central system
    }));
  }, [sortedUsers]);
  
  // Format the tooltip to show username and tweet count
  const tooltipFormatter = (value: number, name: string, props: any) => {
    return [`${value} tweets`, props.payload.username];
  };
  
  // Handle bar click to display user tweets
  const handleBarClick = (data: any) => {
    const user = userData.find(u => u.userId === data.userId);
    if (user) {
      setSelectedUser(user);
      setShowDrawer(true);
      console.log("Selected user for tweets:", user);
    }
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedUser(null);
  };
  
  if (!userData.length) {
    return <div className="text-center py-8 text-muted-foreground">No data available</div>;
  }

  return (
    <>
      {focusStartDate && focusEndDate && (
        <div className="text-xs text-muted-foreground mb-4">
          Showing tweet distribution for selected time period
        </div>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={displayUsers}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          onClick={(data) => {
            if (data?.activePayload?.[0]?.payload) {
              handleBarClick(data.activePayload[0].payload);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={false} />
          <XAxis type="number" allowDecimals={false} />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            width={90}
          />
          <Tooltip 
            formatter={tooltipFormatter}
            labelFormatter={(label) => `User: ${label}`}
          />
          <Bar dataKey="count" className="cursor-pointer">
            {displayUsers.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || CHART_COLORS.primary} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-2 text-xs text-muted-foreground flex items-center">
        <Info className="h-3 w-3 mr-1" />
        <span>Click on any bar to view tweets from that user</span>
      </div>
      
      {/* Use Drawer for mobile and Sheet for desktop */}
      {isMobile ? (
        <Drawer open={showDrawer} onOpenChange={setShowDrawer}>
          <DrawerContent className="max-h-[85vh]">
            <DrawerHeader>
              <DrawerTitle>
                Tweets by {selectedUser?.name || selectedUser?.username}
              </DrawerTitle>
              <div className="text-sm text-muted-foreground">
                @{selectedUser?.username}
              </div>
            </DrawerHeader>
            <div className="px-4 pb-6">
              {selectedUser && (
                <>
                  <div className="text-xs text-muted-foreground mb-4">
                    Connection ID: {selectedUser.userId}
                    {connectionUsernames[selectedUser.userId] && (
                      <> → Username in database: {connectionUsernames[selectedUser.userId]}</>
                    )}
                  </div>
                  <TweetList userId={selectedUser.userId} />
                </>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet open={showDrawer} onOpenChange={setShowDrawer}>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            <div className="py-6">
              <h2 className="text-2xl font-semibold mb-1">
                {selectedUser?.name || selectedUser?.username}
              </h2>
              <div className="text-sm text-muted-foreground mb-2">
                @{selectedUser?.username}
              </div>
              {selectedUser && (
                <>
                  <div className="text-xs text-muted-foreground mb-4">
                    Connection ID: {selectedUser.userId}
                    {connectionUsernames[selectedUser.userId] && (
                      <> → Username in database: {connectionUsernames[selectedUser.userId]}</>
                    )}
                  </div>
                  <TweetList userId={selectedUser.userId} />
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
