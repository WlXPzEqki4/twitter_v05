
import { useUserTweets } from "@/hooks/twitter";
import { Skeleton } from "@/components/ui/skeleton";
import { TweetWithAll } from "@/types/twitter";
import { MessageSquare, Heart, Repeat, Share, Info } from "lucide-react";

interface TweetListProps {
  userId: string;
}

export const TweetList = ({ userId }: TweetListProps) => {
  const { data: tweets, isLoading, error } = useUserTweets(userId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-red-500">
        <Info className="h-6 w-6 mx-auto mb-2" />
        <p>Error loading tweets: {error.message}</p>
        <p className="text-xs mt-2">User ID: {userId}</p>
      </div>
    );
  }

  if (!tweets?.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <MessageSquare className="h-6 w-6 mx-auto mb-2 opacity-50" />
        <p className="mb-1">No tweets available</p>
        <p className="text-xs">This user may not have any tweets in the database.</p>
        <p className="text-xs mt-2">User ID: {userId}</p>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Tweets</h3>
      <div className="text-xs text-muted-foreground mb-4">
        User ID: {userId}
      </div>
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {tweets.map((tweet) => (
          <div key={tweet.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            {tweet.is_retweet && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <Repeat className="h-4 w-4" />
                <span>Retweeted</span>
              </div>
            )}
            <p className="mb-3">{tweet.content}</p>
            <div className="mt-2">
              {tweet.themes && tweet.themes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tweet.themes.map(({ theme }) => (
                    <span 
                      key={theme.id} 
                      className="text-xs px-2 py-0.5 rounded-full" 
                      style={{ 
                        backgroundColor: theme.color ? `${theme.color}30` : '#e2e8f0',
                        color: theme.color || '#64748b'
                      }}
                    >
                      {theme.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="text-sm text-muted-foreground">{formatDate(tweet.posted_at)}</div>
              <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{formatNumber(tweet.engagement?.likes_count || 0)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Repeat className="h-4 w-4" />
                  <span>{formatNumber(tweet.engagement?.retweets_count || 0)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{formatNumber(tweet.engagement?.replies_count || 0)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share className="h-4 w-4" />
                  <span>{formatNumber(tweet.engagement?.quotes_count || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
