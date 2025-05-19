
export interface User {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  followers_count: number;
  following_count: number;
  joined_date: string;
}

export interface Tweet {
  id: string;
  user_id: string;
  content: string;
  posted_at: string;
  is_retweet: boolean;
  original_tweet_id: string | null;
  media_url: string | null;
}

export interface Engagement {
  id: string;
  tweet_id: string;
  likes_count: number;
  retweets_count: number;
  replies_count: number;
  quotes_count: number;
  views_count: number;
}

export interface Theme {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
}

export interface TweetTheme {
  id: string;
  tweet_id: string;
  theme_id: string;
  relevance_score: number;
}

export interface TweetWithEngagement extends Tweet {
  engagement: Engagement;
}

export interface TweetWithThemes extends Tweet {
  themes: Array<{
    theme: Theme;
    relevance_score: number;
  }>;
}

export interface TweetWithAll extends Tweet {
  engagement: Engagement;
  themes: Array<{
    theme: Theme;
    relevance_score: number;
  }>;
  user: User;
}

export interface ThemeAnalysis {
  theme: Theme;
  tweetCount: number;
  averageEngagement: number;
  totalEngagement: number;
}

export interface DailyStats {
  date: string;
  tweetCount: number;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  views: number;
}
