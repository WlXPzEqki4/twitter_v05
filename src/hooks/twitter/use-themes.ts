
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Theme, ThemeAnalysis } from "@/types/twitter";

/**
 * Hook to fetch all available themes
 */
export function useThemes() {
  return useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("themes")
        .select("*");

      if (error) {
        throw new Error(error.message);
      }

      return data as Theme[];
    }
  });
}

/**
 * Hook to get theme analysis for a specific user
 */
export function useThemeAnalysis(userId: string) {
  return useQuery({
    queryKey: ["theme-analysis", userId],
    queryFn: async () => {
      // First get the tweets
      const { data: tweets, error: tweetsError } = await supabase
        .from("tweets")
        .select(`
          id,
          engagements(*)
        `)
        .eq("user_id", userId);

      if (tweetsError) throw new Error(tweetsError.message);

      // Then get the themes for these tweets
      const tweetIds = tweets.map(t => t.id);
      const { data: tweetThemes, error: themesError } = await supabase
        .from("tweet_themes")
        .select(`
          *,
          theme:themes(*)
        `)
        .in("tweet_id", tweetIds);

      if (themesError) throw new Error(themesError.message);

      // Group by theme and calculate stats
      const themeMap: Record<string, ThemeAnalysis> = {};

      tweetThemes.forEach((tt: any) => {
        const theme = tt.theme;
        const tweetId = tt.tweet_id;
        const tweet = tweets.find(t => t.id === tweetId);
        const engagement = tweet.engagements[0] || { 
          likes_count: 0, 
          retweets_count: 0, 
          replies_count: 0, 
          quotes_count: 0, 
          views_count: 0 
        };
        
        const totalEngagement = 
          engagement.likes_count + 
          engagement.retweets_count + 
          engagement.replies_count + 
          engagement.quotes_count;

        if (!themeMap[theme.id]) {
          themeMap[theme.id] = {
            theme,
            tweetCount: 0,
            averageEngagement: 0,
            totalEngagement: 0
          };
        }

        themeMap[theme.id].tweetCount += 1;
        themeMap[theme.id].totalEngagement += totalEngagement;
      });

      // Calculate averages
      const result = Object.values(themeMap).map(item => ({
        ...item,
        averageEngagement: item.totalEngagement / item.tweetCount
      }));

      return result.sort((a, b) => b.tweetCount - a.tweetCount);
    },
    enabled: !!userId,
  });
}
