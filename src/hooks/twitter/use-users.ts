
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/twitter";

/**
 * Hook to fetch the list of all users
 */
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("followers_count", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as User[];
    },
  });
}

/**
 * Hook to fetch a single user profile by ID
 */
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as User;
    },
    enabled: !!userId,
  });
}
