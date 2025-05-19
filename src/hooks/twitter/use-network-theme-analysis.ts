
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ThemeSourceData {
  themeId: string;
  themeName: string;
  themeColor: string;
  sources: Array<{
    sourceId: string;
    username: string;
    displayName: string;
    tweetCount: number;
    relevanceScore: number;
  }>;
  totalTweets: number;
  averageRelevance: number;
}

export interface SourceThemeData {
  sourceId: string;
  username: string;
  displayName: string;
  themes: Array<{
    themeId: string;
    themeName: string;
    themeColor: string;
    tweetCount: number;
    relevanceScore: number;
  }>;
  totalTweets: number;
}

export interface NetworkThemeAnalysis {
  byTheme: ThemeSourceData[];
  bySource: SourceThemeData[];
  totalThemes: number;
  totalSources: number;
  totalTweets: number;
}

/**
 * Hook to fetch and analyze theme distribution in a user's network
 */
export function useNetworkThemeAnalysis(userId: string) {
  return useQuery({
    queryKey: ["network-theme-analysis", userId],
    queryFn: async () => {
      // Fetch theme data from the view we created
      const { data: themeData, error } = await supabase
        .from("network_themes_view")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching network theme data:", error);
        throw new Error(error.message);
      }

      // Process the data to group by theme and by source
      const themeMap = new Map<string, ThemeSourceData>();
      const sourceMap = new Map<string, SourceThemeData>();
      let totalTweets = 0;

      themeData.forEach((item) => {
        totalTweets += item.tweet_count || 0;
        
        // Group by theme
        if (!themeMap.has(item.theme_id)) {
          themeMap.set(item.theme_id, {
            themeId: item.theme_id,
            themeName: item.theme_name,
            themeColor: item.theme_color || "#7E69AB",
            sources: [],
            totalTweets: 0,
            averageRelevance: 0
          });
        }
        
        const theme = themeMap.get(item.theme_id)!;
        theme.sources.push({
          sourceId: item.source_id,
          username: item.source_username,
          displayName: item.source_display_name,
          tweetCount: item.tweet_count || 0,
          relevanceScore: item.avg_relevance || 0
        });
        theme.totalTweets += item.tweet_count || 0;
        
        // Group by source
        if (!sourceMap.has(item.source_id)) {
          sourceMap.set(item.source_id, {
            sourceId: item.source_id,
            username: item.source_username,
            displayName: item.source_display_name,
            themes: [],
            totalTweets: 0
          });
        }
        
        const source = sourceMap.get(item.source_id)!;
        source.themes.push({
          themeId: item.theme_id,
          themeName: item.theme_name,
          themeColor: item.theme_color || "#7E69AB",
          tweetCount: item.tweet_count || 0,
          relevanceScore: item.avg_relevance || 0
        });
        source.totalTweets += item.tweet_count || 0;
      });
      
      // Calculate averages and sort the data
      themeMap.forEach(theme => {
        theme.averageRelevance = theme.sources.reduce((sum, s) => sum + s.relevanceScore, 0) / theme.sources.length;
        theme.sources.sort((a, b) => b.tweetCount - a.tweetCount);
      });
      
      // Convert maps to arrays and sort
      const byTheme = Array.from(themeMap.values())
        .sort((a, b) => b.totalTweets - a.totalTweets);
        
      const bySource = Array.from(sourceMap.values())
        .sort((a, b) => b.totalTweets - a.totalTweets);
      
      // Each source should have their themes sorted
      bySource.forEach(source => {
        source.themes.sort((a, b) => b.tweetCount - a.tweetCount);
      });
      
      return {
        byTheme,
        bySource,
        totalThemes: themeMap.size,
        totalSources: sourceMap.size,
        totalTweets
      } as NetworkThemeAnalysis;
    },
    enabled: !!userId,
  });
}
