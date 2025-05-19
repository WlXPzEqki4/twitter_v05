
import { useUserProfile } from "@/hooks/twitter";
import { User } from "@/types/twitter";
import { CalendarIcon, MapPinIcon, UsersIcon, UserIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileCardProps {
  userId: string;
}

export const ProfileCard = ({ userId }: ProfileCardProps) => {
  const { data: user, isLoading, error } = useUserProfile(userId);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 w-full">
        <Skeleton className="h-16 w-16 rounded-full mb-4" />
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2 mb-4" />
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-4 mt-4">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="text-red-500">Error loading profile</div>
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

  const joinedDate = new Date(user.joined_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      {/* Avatar and name */}
      <div className="flex items-start gap-4 mb-4">
        {user.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt={user.display_name} 
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
            <UserIcon className="text-slate-500 h-8 w-8" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{user.display_name}</h3>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      {/* Bio */}
      {user.bio && <p className="text-sm mb-4">{user.bio}</p>}

      {/* Stats */}
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        {user.location && (
          <div className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            <span>{user.location}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          <span>Joined {joinedDate}</span>
        </div>
      </div>

      {/* Follow counts */}
      <div className="flex gap-4 mt-4">
        <div>
          <span className="font-semibold">{formatNumber(user.following_count)}</span>
          <span className="text-muted-foreground text-sm ml-1">Following</span>
        </div>
        <div>
          <span className="font-semibold">{formatNumber(user.followers_count)}</span>
          <span className="text-muted-foreground text-sm ml-1">Followers</span>
        </div>
      </div>
    </div>
  );
};
