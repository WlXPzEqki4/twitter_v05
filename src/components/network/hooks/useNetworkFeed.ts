
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUsernameColor } from "@/hooks/twitter/use-color-palette";

export interface NetworkFeedData {
  dailyTweets: DailyTweets[];
  userTweetCounts: UserTweetCount[];
}

export interface DailyTweets {
  date: string;
  count: number;
  userCounts: Record<string, number>;
  userNames: Record<string, string>;
}

export interface UserTweetCount {
  userId: string;
  username: string;
  name: string;
  count: number;
  color?: string;
  profile_color?: string;
}

export const useNetworkFeed = (userId: string, timeRange: number = 30) => {
  const [data, setData] = useState<NetworkFeedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNetworkFeed = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Get the list of users that this user follows
        const { data: followData, error: followError } = await supabase
          .from("user_follows")
          .select("following_id")
          .eq("follower_id", userId);
          
        if (followError) throw followError;

        const followingIds = followData.map(f => f.following_id);
        followingIds.push(userId); // Include the user's own tweets
        
        // Get the start date (n days ago)
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);
        
        // Get tweets from the network within the time range
        const { data: tweetData, error: tweetError } = await supabase
          .from("tweets")
          .select(`
            id,
            user_id,
            posted_at,
            users:user_id (username, display_name, profile_color)
          `)
          .in("user_id", followingIds)
          .gte("posted_at", startDate.toISOString())
          .order("posted_at", { ascending: true });
          
        if (tweetError) throw tweetError;
        
        // Process data for visualization
        const dailyTweetsMap: Record<string, DailyTweets> = {};
        const userCountsMap: Record<string, UserTweetCount> = {};
        const userNameMap: Record<string, string> = {}; // Map user IDs to usernames
        
        tweetData.forEach(tweet => {
          // Format date to YYYY-MM-DD
          const date = new Date(tweet.posted_at).toISOString().split('T')[0];
          const userId = tweet.user_id;
          const username = tweet.users?.username || 'unknown';
          const name = tweet.users?.display_name || 'Unknown User';
          
          // Store username for this user ID
          userNameMap[userId] = username;
          
          // Update daily tweets
          if (!dailyTweetsMap[date]) {
            dailyTweetsMap[date] = {
              date,
              count: 0,
              userCounts: {},
              userNames: {}
            };
          }
          
          dailyTweetsMap[date].count++;
          
          if (!dailyTweetsMap[date].userCounts[userId]) {
            dailyTweetsMap[date].userCounts[userId] = 0;
            dailyTweetsMap[date].userNames[userId] = username;
          }
          
          dailyTweetsMap[date].userCounts[userId]++;
          
          // Update user counts
          if (!userCountsMap[userId]) {
            userCountsMap[userId] = {
              userId,
              username,
              name,
              count: 0,
              profile_color: tweet.users?.profile_color
            };
          }
          
          userCountsMap[userId].count++;
        });
        
        // Convert to arrays and sort
        const dailyTweets = Object.values(dailyTweetsMap).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        const userTweetCounts = Object.values(userCountsMap).sort(
          (a, b) => b.count - a.count
        );
        
        // Use our consistent color assignments from the central color system
        userTweetCounts.forEach((user) => {
          // Use the central color system to get a consistent color for this username
          user.color = getUsernameColor(user.username);
        });
        
        // Make sure the root user (current selected user) gets a consistent color
        const rootUserIndex = userTweetCounts.findIndex(u => u.userId === userId);
        if (rootUserIndex !== -1) {
          // Move root user to the top for better visualization
          const rootUser = userTweetCounts.splice(rootUserIndex, 1)[0];
          rootUser.color = getUsernameColor(rootUser.username);
          userTweetCounts.unshift(rootUser);
        }
        
        setData({
          dailyTweets,
          userTweetCounts
        });
      } catch (err) {
        console.error("Error fetching network feed:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetworkFeed();
  }, [userId, timeRange]);

  return { data, isLoading, error };
};
