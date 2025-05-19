
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TweetWithAll } from "@/types/twitter";
import { connectionUsernames } from "./use-connection-usernames";

interface UseUserTweetsOptions {
  enabled?: boolean;
  limit?: number;
}

/**
 * Hook to fetch tweets for a specific user
 */
export function useUserTweets(userId: string, options?: UseUserTweetsOptions) {
  return useQuery({
    queryKey: ["tweets", userId],
    queryFn: async () => {
      console.log(`Fetching tweets for user ID: ${userId}`);
      
      if (!userId) {
        console.error("No user ID provided to useUserTweets");
        return [];
      }
      
      // Check if the ID is a connection ID format or UUID
      let actualUserId = userId;
      let usernameFilter = false;
      let username: string | null = null;
      
      // Use the mapping for all known IDs to usernames
      username = connectionUsernames[userId] || null;
      
      if (username) {
        console.log(`Mapped ${userId} to username: ${username}`);
        usernameFilter = true;
        actualUserId = username;
      } else {
        console.log(`No mapping found for user ID ${userId}, using ID directly`);
      }
      
      console.log(`Using ${usernameFilter ? "username filter" : "user_id filter"} with value: ${actualUserId}`);
      
      // Special case for Gwynne Shotwell - check for her by ID directly first
      if (userId === "9f56a8a0-31af-4d7f-a9a6-18aa57222c66" || 
          userId === "45022183-ffb3-4941-b921-56f38bee737c") {
        console.log("Special handling for Gwynne Shotwell by ID");
        
        // Try to find Gwynne's user record first
        const { data: gwynneUser } = await supabase
          .from("users")
          .select("id, username")
          .ilike("username", "%gwynne%")
          .limit(1);
          
        if (gwynneUser && gwynneUser.length > 0) {
          console.log(`Found Gwynne's user record: ${gwynneUser[0].id} / ${gwynneUser[0].username}`);
          
          // Use exact ID from database to get tweets
          const { data: gwynneTweets, error: gwynneError } = await supabase
            .from("tweets")
            .select(`
              *,
              engagement:engagements(*),
              themes:tweet_themes(
                *,
                theme:themes(*)
              ),
              user:users(*)
            `)
            .eq("user_id", gwynneUser[0].id)
            .order("posted_at", { ascending: false });
            
          if (!gwynneError && gwynneTweets && gwynneTweets.length > 0) {
            console.log(`Found ${gwynneTweets.length} tweets for Gwynne Shotwell`);
            
            const formattedData: TweetWithAll[] = gwynneTweets.map((tweet: any) => ({
              ...tweet,
              engagement: tweet.engagement?.[0] || {
                likes_count: 0,
                retweets_count: 0,
                replies_count: 0,
                quotes_count: 0,
                views_count: 0
              },
              themes: (tweet.themes || []).map((t: any) => ({
                theme: t.theme,
                relevance_score: t.relevance_score
              })),
              user: tweet.user?.[0] || null
            }));
            
            return formattedData;
          }
        }
      }
      
      let query;
      
      // First try direct user_id lookup if we're using the UUID directly
      if (!usernameFilter) {
        query = supabase
          .from("tweets")
          .select(`
            *,
            engagement:engagements(*),
            themes:tweet_themes(
              *,
              theme:themes(*)
            ),
            user:users(*)
          `)
          .eq("user_id", actualUserId)
          .order("posted_at", { ascending: false });
          
        console.log(`Running query with user_id: ${actualUserId}`);
        
        // Apply limit if provided
        if (options?.limit) {
          query.limit(options.limit);
        }
        
        const { data: idResults, error: idError } = await query;
        
        if (!idError && idResults && idResults.length > 0) {
          console.log(`Found ${idResults.length} tweets using direct user_id lookup`);
          
          const formattedData: TweetWithAll[] = idResults.map((tweet: any) => ({
            ...tweet,
            engagement: tweet.engagement?.[0] || {
              likes_count: 0,
              retweets_count: 0,
              replies_count: 0,
              quotes_count: 0,
              views_count: 0
            },
            themes: (tweet.themes || []).map((t: any) => ({
              theme: t.theme,
              relevance_score: t.relevance_score
            })),
            user: tweet.user?.[0] || null
          }));
          
          return formattedData;
        }
        
        console.log(`No tweets found using direct user_id lookup, trying username lookup...`);
        
        // If direct ID lookup fails, do an auxiliary lookup to find the user's username
        const { data: userLookup } = await supabase
          .from("users")
          .select("username")
          .eq("id", actualUserId)
          .single();
          
        if (userLookup?.username) {
          username = userLookup.username;
          actualUserId = username;
          usernameFilter = true;
          console.log(`Found username ${username} for user ID ${userId}, will try username filtering`);
        }
      }
      
      if (usernameFilter) {
        // For Gwynne Shotwell specific case
        if (actualUserId.toLowerCase() === "gwynneshortwell" || 
            actualUserId.toLowerCase() === "gwynneshotwell" || 
            actualUserId.toLowerCase() === "gwynne shotwell") {
          console.log(`Special handling for Gwynne Shotwell with username: ${actualUserId}`);
          
          // Try all possible variations of the name
          const possibleNames = ["GwynneShotwell", "gwynneshotwell", "GWYNNESHOTWELL", 
                                "Gwynne Shotwell", "GwynneShortwell", "gwynneshortwell"];
          
          for (const name of possibleNames) {
            console.log(`Trying username variation: ${name}`);
            
            // First try exact match
            const { data: exactResults } = await supabase
              .from("tweets")
              .select(`
                *,
                engagement:engagements(*),
                themes:tweet_themes(
                  *,
                  theme:themes(*)
                ),
                user:users!inner(*)
              `)
              .eq("user.username", name)
              .order("posted_at", { ascending: false });
              
            if (exactResults && exactResults.length > 0) {
              console.log(`Found ${exactResults.length} tweets using exact match for ${name}`);
              
              const formattedData: TweetWithAll[] = exactResults.map((tweet: any) => ({
                ...tweet,
                engagement: tweet.engagement?.[0] || {
                  likes_count: 0,
                  retweets_count: 0,
                  replies_count: 0,
                  quotes_count: 0,
                  views_count: 0
                },
                themes: (tweet.themes || []).map((t: any) => ({
                  theme: t.theme,
                  relevance_score: t.relevance_score
                })),
                user: tweet.user?.[0] || null
              }));
              
              return formattedData;
            }
            
            // Then try case-insensitive
            const { data: ilikeResults } = await supabase
              .from("tweets")
              .select(`
                *,
                engagement:engagements(*),
                themes:tweet_themes(
                  *,
                  theme:themes(*)
                ),
                user:users!inner(*)
              `)
              .ilike("user.username", name)
              .order("posted_at", { ascending: false });
              
            if (ilikeResults && ilikeResults.length > 0) {
              console.log(`Found ${ilikeResults.length} tweets using ilike for ${name}`);
              
              const formattedData: TweetWithAll[] = ilikeResults.map((tweet: any) => ({
                ...tweet,
                engagement: tweet.engagement?.[0] || {
                  likes_count: 0,
                  retweets_count: 0,
                  replies_count: 0,
                  quotes_count: 0,
                  views_count: 0
                },
                themes: (tweet.themes || []).map((t: any) => ({
                  theme: t.theme,
                  relevance_score: t.relevance_score
                })),
                user: tweet.user?.[0] || null
              }));
              
              return formattedData;
            }
          }
          
          // Also try partial name matching as a last resort
          console.log("Trying partial name matching for Gwynne Shotwell");
          const { data: partialResults } = await supabase
            .from("tweets")
            .select(`
              *,
              engagement:engagements(*),
              themes:tweet_themes(
                *,
                theme:themes(*)
              ),
              user:users!inner(*)
            `)
            .ilike("user.username", "%gwynne%")
            .order("posted_at", { ascending: false });
            
          if (partialResults && partialResults.length > 0) {
            console.log(`Found ${partialResults.length} tweets using partial match for 'gwynne'`);
            
            const formattedData: TweetWithAll[] = partialResults.map((tweet: any) => ({
              ...tweet,
              engagement: tweet.engagement?.[0] || {
                likes_count: 0,
                retweets_count: 0,
                replies_count: 0,
                quotes_count: 0,
                views_count: 0
              },
              themes: (tweet.themes || []).map((t: any) => ({
                theme: t.theme,
                relevance_score: t.relevance_score
              })),
              user: tweet.user?.[0] || null
            }));
            
            return formattedData;
          }
        }
        
        // Try case-insensitive match first
        query = supabase
          .from("tweets")
          .select(`
            *,
            engagement:engagements(*),
            themes:tweet_themes(
              *,
              theme:themes(*)
            ),
            user:users!inner(*)
          `)
          .ilike("user.username", actualUserId)
          .order("posted_at", { ascending: false });
          
        console.log(`Running query with ilike on user.username: ${actualUserId}`);
      } else {
        // Fallback to the original query
        query = supabase
          .from("tweets")
          .select(`
            *,
            engagement:engagements(*),
            themes:tweet_themes(
              *,
              theme:themes(*)
            ),
            user:users(*)
          `)
          .eq("user_id", actualUserId)
          .order("posted_at", { ascending: false });
      }
        
      // Apply limit if provided
      if (options?.limit) {
        query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching tweets:", error.message);
        throw new Error(error.message);
      }

      console.log(`Retrieved ${data?.length || 0} tweets for user ID/username: ${actualUserId}`);

      // If no tweets found with the original query and we're using username filter,
      // try alternative approaches
      if ((!data || data.length === 0) && usernameFilter) {
        console.log(`No tweets found for username: ${actualUserId}, trying alternate approaches...`);
        
        // Try direct match with exact username instead of ilike
        const { data: directMatchData, error: directMatchError } = await supabase
          .from("tweets")
          .select(`
            *,
            engagement:engagements(*),
            themes:tweet_themes(
              *,
              theme:themes(*)
            ),
            user:users!inner(*)
          `)
          .eq("user.username", actualUserId)
          .order("posted_at", { ascending: false });
          
        if (!directMatchError && directMatchData && directMatchData.length > 0) {
          console.log(`Found ${directMatchData.length} tweets using exact match for ${actualUserId}`);
          
          const formattedData: TweetWithAll[] = directMatchData.map((tweet: any) => ({
            ...tweet,
            engagement: tweet.engagement?.[0] || {
              likes_count: 0,
              retweets_count: 0,
              replies_count: 0,
              quotes_count: 0,
              views_count: 0
            },
            themes: (tweet.themes || []).map((t: any) => ({
              theme: t.theme,
              relevance_score: t.relevance_score
            })),
            user: tweet.user?.[0] || null
          }));
          
          return formattedData;
        }
        
        // Try uppercase version
        const upperCaseUsername = actualUserId.toUpperCase();
        console.log(`Trying uppercase version: ${upperCaseUsername}`);
        
        const { data: upperData, error: upperError } = await supabase
          .from("tweets")
          .select(`
            *,
            engagement:engagements(*),
            themes:tweet_themes(
              *,
              theme:themes(*)
            ),
            user:users!inner(*)
          `)
          .ilike("user.username", upperCaseUsername)
          .order("posted_at", { ascending: false });
          
        if (!upperError && upperData && upperData.length > 0) {
          console.log(`Found ${upperData.length} tweets using uppercase ${upperCaseUsername}`);
          
          const formattedData: TweetWithAll[] = upperData.map((tweet: any) => ({
            ...tweet,
            engagement: tweet.engagement?.[0] || {
              likes_count: 0,
              retweets_count: 0,
              replies_count: 0,
              quotes_count: 0,
              views_count: 0
            },
            themes: (tweet.themes || []).map((t: any) => ({
              theme: t.theme,
              relevance_score: t.relevance_score
            })),
            user: tweet.user?.[0] || null
          }));
          
          return formattedData;
        }
        
        // Try to look up the user first, then get their tweets
        console.log(`Trying user lookup approach for ${actualUserId}`);
        
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, username")
          .ilike("username", actualUserId);
          
        if (!userError && userData && userData.length > 0) {
          console.log(`Found user(s) matching ${actualUserId}:`, userData);
          
          // Try to get tweets for the first matching user
          const matchedUserId = userData[0].id;
          
          const { data: matchedTweets, error: matchedError } = await supabase
            .from("tweets")
            .select(`
              *,
              engagement:engagements(*),
              themes:tweet_themes(
                *,
                theme:themes(*)
              ),
              user:users(*)
            `)
            .eq("user_id", matchedUserId)
            .order("posted_at", { ascending: false });
            
          if (!matchedError && matchedTweets && matchedTweets.length > 0) {
            console.log(`Found ${matchedTweets.length} tweets for user ID ${matchedUserId} (${actualUserId})`);
            
            const formattedData: TweetWithAll[] = matchedTweets.map((tweet: any) => ({
              ...tweet,
              engagement: tweet.engagement?.[0] || {
                likes_count: 0,
                retweets_count: 0,
                replies_count: 0,
                quotes_count: 0,
                views_count: 0
              },
              themes: (tweet.themes || []).map((t: any) => ({
                theme: t.theme,
                relevance_score: t.relevance_score
              })),
              user: tweet.user?.[0] || null
            }));
            
            return formattedData;
          }
        }
      }

      // If we get here and data exists, format and return it
      if (data && data.length > 0) {
        const formattedData: TweetWithAll[] = data.map((tweet: any) => ({
          ...tweet,
          engagement: tweet.engagement?.[0] || {
            likes_count: 0,
            retweets_count: 0,
            replies_count: 0,
            quotes_count: 0,
            views_count: 0
          },
          themes: (tweet.themes || []).map((t: any) => ({
            theme: t.theme,
            relevance_score: t.relevance_score
          })),
          user: tweet.user?.[0] || null
        }));

        return formattedData;
      }
      
      // If all attempts failed, return empty array
      return [];
    },
    enabled: options?.enabled !== false && !!userId,
  });
}
