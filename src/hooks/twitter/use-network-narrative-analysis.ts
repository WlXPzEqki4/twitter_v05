
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NarrativeSourceData {
  narrativeId: string;
  narrativeName: string;
  narrativeColor: string;
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

export interface SourceNarrativeData {
  sourceId: string;
  username: string;
  displayName: string;
  narratives: Array<{
    narrativeId: string;
    narrativeName: string;
    narrativeColor: string;
    themeId: string;
    themeName: string;
    themeColor: string;
    tweetCount: number;
    relevanceScore: number;
  }>;
  totalTweets: number;
}

export interface NetworkNarrativeAnalysis {
  byNarrative: NarrativeSourceData[];
  bySource: SourceNarrativeData[];
  totalNarratives: number;
  totalSources: number;
  totalTweets: number;
}

// Helper function to transform placeholder narrative names into more contemporary ones
const transformNarrativeName = (originalName: string): string => {
  // Extract the prefix (everything before the hyphen and space)
  const match = originalName.match(/^(.*?) - /);
  const prefix = match ? match[1] : "";
  
  // Map of narrative replacements based on prefixes
  const narrativesByPrefix: Record<string, string[]> = {
    "AI": [
      "AI - Threat to Jobs", 
      "AI - Solving Healthcare", 
      "AI - Ethical Concerns", 
      "AI - Creative Revolution",
      "AI - Safety Risks"
    ],
    "Technology": [
      "Technology - Privacy Concerns", 
      "Technology - Remote Work Shift", 
      "Technology - Digital Divide", 
      "Technology - Sustainable Innovation",
      "Technology - Big Tech Regulation"
    ],
    "Politics": [
      "Politics - Election Integrity", 
      "Politics - Climate Policy", 
      "Politics - Healthcare Reform", 
      "Politics - Global Alliances",
      "Politics - Economic Recovery"
    ],
    "Health": [
      "Health - Vaccine Development", 
      "Health - Mental Wellness Focus", 
      "Health - Healthcare Access", 
      "Health - Pandemic Preparedness",
      "Health - Telemedicine Growth"
    ],
    "Economy": [
      "Economy - Inflation Concerns", 
      "Economy - Crypto Integration", 
      "Economy - Supply Chain Issues", 
      "Economy - Workforce Automation",
      "Economy - Wealth Inequality"
    ],
    "Climate": [
      "Climate - Renewable Transition", 
      "Climate - Extreme Weather Events", 
      "Climate - Carbon Neutrality", 
      "Climate - Corporate Responsibility",
      "Climate - Sustainable Living"
    ],
    "Personal": [
      "Personal - Digital Wellbeing", 
      "Personal - Remote Work Balance", 
      "Personal - Financial Security", 
      "Personal - Social Reconnection",
      "Personal - Skill Adaptation"
    ],
    "Cryptocurrency": [
      "Cryptocurrency - DeFi Revolution", 
      "Cryptocurrency - Regulatory Challenges", 
      "Cryptocurrency - Institutional Adoption", 
      "Cryptocurrency - Environmental Impact",
      "Cryptocurrency - Payment Evolution"
    ],
    "Philosophy": [
      "Philosophy - Digital Ethics", 
      "Philosophy - Polarization Solutions", 
      "Philosophy - Modern Stoicism", 
      "Philosophy - AI Consciousness",
      "Philosophy - Post-Truth Era"
    ],
    "Automotive": [
      "Automotive - Electric Revolution", 
      "Automotive - Self-Driving Progress", 
      "Automotive - Sustainable Transport", 
      "Automotive - Ownership Models",
      "Automotive - Urban Mobility"
    ],
    "Investment": [
      "Investment - Retail Trading Movement", 
      "Investment - ESG Focus", 
      "Investment - Algorithmic Trading", 
      "Investment - Market Volatility",
      "Investment - Private Markets Access"
    ],
    "Business": [
      "Business - Remote-First Culture", 
      "Business - Purpose-Driven Companies", 
      "Business - Supply Chain Resilience", 
      "Business - Talent Acquisition Crisis",
      "Business - Digital Transformation"
    ],
    "Space": [
      "Space - Commercial Exploration", 
      "Space - Satellite Internet", 
      "Space - Mars Colonization", 
      "Space - Orbital Tourism",
      "Space - Asteroid Resources"
    ]
  };
  
  // If we have specific narratives for this prefix, use them
  if (prefix && narrativesByPrefix[prefix]) {
    // Use the original name if it's already one of our contemporary names
    if (narrativesByPrefix[prefix].includes(originalName)) {
      return originalName;
    }
    
    // Find a name from our list that hasn't been used yet
    // For simplicity, we'll just pick based on the narrative ID's last character
    const lastChar = originalName.charCodeAt(originalName.length - 1) % narrativesByPrefix[prefix].length;
    return narrativesByPrefix[prefix][lastChar];
  }
  
  // Fallback - keep the original name
  return originalName;
};

/**
 * Hook to fetch and analyze narrative distribution in a user's network
 */
export function useNetworkNarrativeAnalysis(userId: string) {
  return useQuery({
    queryKey: ["network-narrative-analysis", userId],
    queryFn: async () => {
      // Fetch narrative data from the view we created
      const { data: narrativeData, error } = await supabase
        .from("network_narratives_view")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching network narrative data:", error);
        throw new Error(error.message);
      }

      // Process the data to group by narrative and by source
      const narrativeMap = new Map<string, NarrativeSourceData>();
      const sourceMap = new Map<string, SourceNarrativeData>();
      let totalTweets = 0;

      narrativeData.forEach((item) => {
        totalTweets += item.tweet_count || 0;
        
        // Transform the narrative name
        const narrativeName = transformNarrativeName(item.narrative_name);
        
        // Group by narrative
        if (!narrativeMap.has(item.narrative_id)) {
          narrativeMap.set(item.narrative_id, {
            narrativeId: item.narrative_id,
            narrativeName: narrativeName,
            narrativeColor: item.narrative_color || "#6E5494",
            themeId: item.theme_id,
            themeName: item.theme_name,
            themeColor: item.theme_color,
            sources: [],
            totalTweets: 0,
            averageRelevance: 0
          });
        }
        
        const narrative = narrativeMap.get(item.narrative_id)!;
        narrative.sources.push({
          sourceId: item.source_id,
          username: item.source_username,
          displayName: item.source_display_name,
          tweetCount: item.tweet_count || 0,
          relevanceScore: item.avg_relevance || 0
        });
        narrative.totalTweets += item.tweet_count || 0;
        
        // Group by source
        if (!sourceMap.has(item.source_id)) {
          sourceMap.set(item.source_id, {
            sourceId: item.source_id,
            username: item.source_username,
            displayName: item.source_display_name,
            narratives: [],
            totalTweets: 0
          });
        }
        
        const source = sourceMap.get(item.source_id)!;
        source.narratives.push({
          narrativeId: item.narrative_id,
          narrativeName: narrativeName,
          narrativeColor: item.narrative_color || "#6E5494",
          themeId: item.theme_id,
          themeName: item.theme_name,
          themeColor: item.theme_color,
          tweetCount: item.tweet_count || 0,
          relevanceScore: item.avg_relevance || 0
        });
        source.totalTweets += item.tweet_count || 0;
      });
      
      // Calculate averages and sort the data
      narrativeMap.forEach(narrative => {
        narrative.averageRelevance = narrative.sources.reduce((sum, s) => sum + s.relevanceScore, 0) / narrative.sources.length;
        narrative.sources.sort((a, b) => b.tweetCount - a.tweetCount);
      });
      
      // Convert maps to arrays and sort
      const byNarrative = Array.from(narrativeMap.values())
        .sort((a, b) => b.totalTweets - a.totalTweets);
        
      const bySource = Array.from(sourceMap.values())
        .sort((a, b) => b.totalTweets - a.totalTweets);
      
      // Each source should have their narratives sorted
      bySource.forEach(source => {
        source.narratives.sort((a, b) => b.tweetCount - a.tweetCount);
      });
      
      return {
        byNarrative,
        bySource,
        totalNarratives: narrativeMap.size,
        totalSources: sourceMap.size,
        totalTweets
      } as NetworkNarrativeAnalysis;
    },
    enabled: !!userId,
  });
}
