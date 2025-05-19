
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NetworkData, NetworkNode } from "../types";

export function useNetworkData(userId: string, depth: number = 1) {
  return useQuery({
    queryKey: ["network", userId, depth],
    queryFn: async () => {
      try {
        // First get the user data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();
          
        if (userError) throw new Error(userError.message);
        if (!userData) throw new Error("User not found");
        
        console.log("Fetched user data:", userData);
        
        // Initialize network data with the root user
        const nodes: NetworkData["nodes"] = [
          {
            id: userData.id,
            name: userData.display_name,
            username: userData.username,
            avatar: userData.avatar_url,
            followers: userData.followers_count,
            following: userData.following_count,
            profile_color: userData.profile_color,
            verified: userData.verified,
            bio: userData.bio,
            location: userData.location,
            influence_score: userData.influence_score
          }
        ];
        
        const links: NetworkData["links"] = [];
        const processedUserIds = new Set([userId]);
        
        // Get users that the root user follows
        const { data: followingData, error: followingError } = await supabase
          .from("user_follows")
          .select(`
            following_id,
            following:users!user_follows_following_id_fkey(*)
          `)
          .eq("follower_id", userId);
          
        if (followingError) throw new Error(followingError.message);
        
        // Add first-degree connections
        followingData.forEach(item => {
          if (item.following && item.following_id && !processedUserIds.has(item.following_id)) {
            const followingUser = item.following;
            
            nodes.push({
              id: followingUser.id,
              name: followingUser.display_name,
              username: followingUser.username,
              avatar: followingUser.avatar_url,
              followers: followingUser.followers_count,
              following: followingUser.following_count,
              profile_color: followingUser.profile_color,
              verified: followingUser.verified,
              bio: followingUser.bio,
              location: followingUser.location,
              influence_score: followingUser.influence_score
            });
            
            links.push({
              source: userId,
              target: followingUser.id
            });
            
            processedUserIds.add(followingUser.id);
          }
        });
        
        // Get users that follow the root user
        const { data: followersData, error: followersError } = await supabase
          .from("user_follows")
          .select(`
            follower_id,
            follower:users!user_follows_follower_id_fkey(*)
          `)
          .eq("following_id", userId);
          
        if (followersError) throw new Error(followersError.message);
        
        // Add followers to the network
        followersData.forEach(item => {
          if (item.follower && item.follower_id && !processedUserIds.has(item.follower_id)) {
            const followerUser = item.follower;
            
            nodes.push({
              id: followerUser.id,
              name: followerUser.display_name,
              username: followerUser.username,
              avatar: followerUser.avatar_url,
              followers: followerUser.followers_count,
              following: followerUser.following_count,
              profile_color: followerUser.profile_color,
              verified: followerUser.verified,
              bio: followerUser.bio,
              location: followerUser.location,
              influence_score: followerUser.influence_score
            });
            
            links.push({
              source: followerUser.id,
              target: userId
            });
            
            processedUserIds.add(followerUser.id);
          }
        });
        
        // Removed the interconnections between users in the network
        // This focuses only on direct Musk -> User or User -> Musk connections
        
        // If depth > 1, get second-degree connections
        if (depth > 1) {
          const firstDegreeIds = [...processedUserIds].filter(id => id !== userId);
          
          for (const connectionId of firstDegreeIds) {
            // Get who this connection follows
            const { data: secondDegreeFollowing } = await supabase
              .from("user_follows")
              .select(`
                following_id,
                following:users!user_follows_following_id_fkey(*)
              `)
              .eq("follower_id", connectionId)
              .limit(5); // Limit to prevent too many connections
              
            if (secondDegreeFollowing) {
              secondDegreeFollowing.forEach(item => {
                if (item.following && item.following_id && !processedUserIds.has(item.following_id)) {
                  const followingUser = item.following;
                  
                  nodes.push({
                    id: followingUser.id,
                    name: followingUser.display_name,
                    username: followingUser.username,
                    avatar: followingUser.avatar_url,
                    followers: followingUser.followers_count,
                    following: followingUser.following_count,
                    profile_color: followingUser.profile_color,
                    verified: followingUser.verified,
                    bio: followingUser.bio,
                    location: followingUser.location,
                    influence_score: followingUser.influence_score
                  });
                  
                  links.push({
                    source: connectionId,
                    target: followingUser.id
                  });
                  
                  processedUserIds.add(followingUser.id);
                }
              });
            }
          }
        }
        
        console.log("Generated network data:", { nodes, links });
        
        const result = { nodes, links } as NetworkData;
        
        return result;
      } catch (error) {
        console.error("Error fetching network data:", error);
        throw error;
      }
    },
    enabled: !!userId,
  });
}
