export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      engagements: {
        Row: {
          id: string
          likes_count: number | null
          quotes_count: number | null
          replies_count: number | null
          retweets_count: number | null
          tweet_id: string
          views_count: number | null
        }
        Insert: {
          id?: string
          likes_count?: number | null
          quotes_count?: number | null
          replies_count?: number | null
          retweets_count?: number | null
          tweet_id: string
          views_count?: number | null
        }
        Update: {
          id?: string
          likes_count?: number | null
          quotes_count?: number | null
          replies_count?: number | null
          retweets_count?: number | null
          tweet_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "engagements_tweet_id_fkey"
            columns: ["tweet_id"]
            isOneToOne: false
            referencedRelation: "tweets"
            referencedColumns: ["id"]
          },
        ]
      }
      narratives: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          theme_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          theme_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          theme_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "narratives_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["theme_id"]
          },
          {
            foreignKeyName: "narratives_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "network_themes_view"
            referencedColumns: ["theme_id"]
          },
          {
            foreignKeyName: "narratives_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
        ]
      }
      network_theme_analysis: {
        Row: {
          analysis_date: string | null
          id: string
          source_aggregation: Json | null
          theme_aggregation: Json | null
          user_id: string
        }
        Insert: {
          analysis_date?: string | null
          id?: string
          source_aggregation?: Json | null
          theme_aggregation?: Json | null
          user_id: string
        }
        Update: {
          analysis_date?: string | null
          id?: string
          source_aggregation?: Json | null
          theme_aggregation?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_theme_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["source_id"]
          },
          {
            foreignKeyName: "network_theme_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "network_theme_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          color: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      tweet_narratives: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          narrative_id: string
          relevance_score: number | null
          tweet_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          narrative_id: string
          relevance_score?: number | null
          tweet_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          narrative_id?: string
          relevance_score?: number | null
          tweet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tweet_narratives_narrative_id_fkey"
            columns: ["narrative_id"]
            isOneToOne: false
            referencedRelation: "narratives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tweet_narratives_narrative_id_fkey"
            columns: ["narrative_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["narrative_id"]
          },
          {
            foreignKeyName: "tweet_narratives_tweet_id_fkey"
            columns: ["tweet_id"]
            isOneToOne: false
            referencedRelation: "tweets"
            referencedColumns: ["id"]
          },
        ]
      }
      tweet_themes: {
        Row: {
          confidence: number | null
          id: string
          relevance_score: number | null
          theme_id: string
          tweet_id: string
        }
        Insert: {
          confidence?: number | null
          id?: string
          relevance_score?: number | null
          theme_id: string
          tweet_id: string
        }
        Update: {
          confidence?: number | null
          id?: string
          relevance_score?: number | null
          theme_id?: string
          tweet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tweet_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["theme_id"]
          },
          {
            foreignKeyName: "tweet_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "network_themes_view"
            referencedColumns: ["theme_id"]
          },
          {
            foreignKeyName: "tweet_themes_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tweet_themes_tweet_id_fkey"
            columns: ["tweet_id"]
            isOneToOne: false
            referencedRelation: "tweets"
            referencedColumns: ["id"]
          },
        ]
      }
      tweets: {
        Row: {
          content: string
          id: string
          is_retweet: boolean | null
          media_url: string | null
          original_tweet_id: string | null
          posted_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          id?: string
          is_retweet?: boolean | null
          media_url?: string | null
          original_tweet_id?: string | null
          posted_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          is_retweet?: boolean | null
          media_url?: string | null
          original_tweet_id?: string | null
          posted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tweets_original_tweet_id_fkey"
            columns: ["original_tweet_id"]
            isOneToOne: false
            referencedRelation: "tweets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tweets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["source_id"]
          },
          {
            foreignKeyName: "tweets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tweets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          followed_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          followed_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          followed_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["source_id"]
          },
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["source_id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          category: string | null
          display_name: string
          followers_count: number | null
          following_count: number | null
          id: string
          influence_score: number | null
          joined_date: string | null
          location: string | null
          profile_color: string | null
          username: string
          verified: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          display_name: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          influence_score?: number | null
          joined_date?: string | null
          location?: string | null
          profile_color?: string | null
          username: string
          verified?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          display_name?: string
          followers_count?: number | null
          following_count?: number | null
          id?: string
          influence_score?: number | null
          joined_date?: string | null
          location?: string | null
          profile_color?: string | null
          username?: string
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      network_narratives_view: {
        Row: {
          avg_relevance: number | null
          narrative_color: string | null
          narrative_id: string | null
          narrative_name: string | null
          source_display_name: string | null
          source_id: string | null
          source_username: string | null
          theme_color: string | null
          theme_id: string | null
          theme_name: string | null
          tweet_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
      network_themes_view: {
        Row: {
          avg_relevance: number | null
          source_display_name: string | null
          source_id: string | null
          source_username: string | null
          theme_color: string | null
          theme_id: string | null
          theme_name: string | null
          tweet_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["source_id"]
          },
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["source_id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "network_narratives_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
