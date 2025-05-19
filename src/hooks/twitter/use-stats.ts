
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DailyStats } from "@/types/twitter";

/**
 * Hook to fetch daily engagement statistics for a user
 */
export function useDailyStats(userId: string, daysCount: number = 7) {
  return useQuery({
    queryKey: ["daily-stats", userId, daysCount],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (daysCount - 1));
      startDate.setHours(0, 0, 0, 0);

      const { data: tweets, error } = await supabase
        .from("tweets")
        .select(`
          id,
          posted_at,
          engagements(*)
        `)
        .eq("user_id", userId)
        .gte("posted_at", startDate.toISOString());

      if (error) {
        throw new Error(error.message);
      }

      // Create a map for days
      const days: Record<string, DailyStats> = {};
      
      // Initialize days
      for (let i = 0; i < daysCount; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        
        days[dateStr] = {
          date: dateStr,
          tweetCount: 0,
          likes: 0,
          retweets: 0,
          replies: 0,
          quotes: 0,
          views: 0
        };
      }
      
      // Process tweets
      tweets.forEach((tweet: any) => {
        const dateStr = new Date(tweet.posted_at).toISOString().split("T")[0];
        if (days[dateStr]) {
          const engagement = tweet.engagements[0] || { 
            likes_count: 0, 
            retweets_count: 0, 
            replies_count: 0, 
            quotes_count: 0, 
            views_count: 0 
          };
          
          days[dateStr].tweetCount += 1;
          days[dateStr].likes += engagement.likes_count;
          days[dateStr].retweets += engagement.retweets_count;
          days[dateStr].replies += engagement.replies_count;
          days[dateStr].quotes += engagement.quotes_count;
          days[dateStr].views += engagement.views_count;
        }
      });
      
      return Object.values(days).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    },
    enabled: !!userId,
  });
}
