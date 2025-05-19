import { UserIcon, Users, MessageSquare, Heart, Repeat, Share, CheckCircle, MapPin, Info } from "lucide-react";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { NetworkNode } from "./types";
import { useUserTweets } from "@/hooks/twitter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { connectionUsernames } from "@/hooks/twitter";

interface NodeDetailPanelProps {
  selectedNode: NetworkNode | null;
  onClose: () => void;
}

export const NodeDetailPanel = ({ selectedNode, onClose }: NodeDetailPanelProps) => {
  // We'll fetch tweets for the selected user if we have a userId
  const { data: tweets, isLoading: tweetsLoading, error: tweetError } = useUserTweets(
    selectedNode?.id || '',
    { enabled: !!selectedNode?.id, limit: 5 }
  );
  
  if (!selectedNode) return null;
  
  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
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
  
  const mappedUsername = connectionUsernames[selectedNode.id] || null;
  
  return (
    <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-xl">Profile Details</SheetTitle>
        <SheetDescription>
          Information about @{selectedNode.username}
        </SheetDescription>
      </SheetHeader>
      
      <div className="mt-6">
        <div className="flex items-start gap-4 mb-4">
          {selectedNode.avatar ? (
            <Avatar className="w-16 h-16">
              <AvatarImage src={selectedNode.avatar} alt={selectedNode.name} />
              <AvatarFallback className="bg-purple-100 text-purple-500">
                {selectedNode.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <UserIcon className="text-purple-500 h-8 w-8" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{selectedNode.name}</h3>
              {selectedNode.verified && (
                <CheckCircle className="h-4 w-4 text-blue-500" />
              )}
            </div>
            <p className="text-gray-500">@{selectedNode.username}</p>
            
            {selectedNode.category && (
              <Badge variant="outline" className="mt-1">
                {selectedNode.category}
              </Badge>
            )}
          </div>
        </div>
        
        {selectedNode.bio && (
          <p className="text-sm text-gray-700 mb-4">{selectedNode.bio}</p>
        )}
        
        {selectedNode.location && (
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <MapPin className="h-4 w-4" />
            <span>{selectedNode.location}</span>
          </div>
        )}
        
        <div className="flex gap-4 mt-4 mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="font-semibold">{formatNumber(selectedNode.following)}</span>
            <span className="text-gray-500 text-sm">Following</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="font-semibold">{formatNumber(selectedNode.followers)}</span>
            <span className="text-gray-500 text-sm">Followers</span>
          </div>
        </div>
        
        <div className="space-y-4 mt-6">
          {selectedNode.bio && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-2">About</h4>
              <p className="text-gray-700 text-sm">
                {selectedNode.bio}
              </p>
            </div>
          )}
          
          {/* Recent Tweets Section */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-2">Recent Tweets</h4>
            
            <div className="text-xs text-muted-foreground mb-2">
              Node ID: {selectedNode.id}
              {mappedUsername && (
                <> → Username in database: {mappedUsername}</>
              )}
            </div>
            
            {tweetsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : tweetError ? (
              <div className="text-center p-4 text-red-500">
                <Info className="h-5 w-5 mx-auto mb-2" />
                <p>Error loading tweets: {tweetError.message}</p>
              </div>
            ) : tweets && tweets.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {tweets.map((tweet) => (
                  <div key={tweet.id} className="rounded-lg border bg-white p-3 text-sm">
                    <p className="mb-2">{tweet.content}</p>
                    
                    {/* Show themes if available */}
                    {tweet.themes && tweet.themes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {tweet.themes.map((themeData) => (
                          <Badge key={themeData.theme.id} variant="outline" className="text-xs">
                            {themeData.theme.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(tweet.posted_at)}</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{tweet.engagement?.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Repeat className="h-3 w-3" />
                          <span>{tweet.engagement?.retweets_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{tweet.engagement?.replies_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share className="h-3 w-3" />
                          <span>{tweet.engagement?.quotes_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p>No tweets available for @{selectedNode.username}.</p>
                <p className="text-xs mt-1">This may be due to the username not matching exactly in the database.</p>
                <p className="text-xs mt-1">Database ID: {selectedNode.id}</p>
                <p className="text-xs mt-1">Mapped username: {mappedUsername || "None"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SheetContent>
  );
};
