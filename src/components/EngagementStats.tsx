
import { useDailyStats } from "@/hooks/twitter";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

interface EngagementStatsProps {
  userId: string;
}

export const EngagementStats = ({ userId }: EngagementStatsProps) => {
  const { data: stats, isLoading, error } = useDailyStats(userId, 7);

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (error || !stats?.length) {
    return <div className="text-red-500">Error loading engagement data</div>;
  }

  // Format dates to be more readable
  const data = stats.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }));

  const config = {
    likes: { color: "#ff6b6b", label: "Likes" },
    retweets: { color: "#4ecdc4", label: "Retweets" },
    replies: { color: "#ffe66d", label: "Replies" },
    quotes: { color: "#1a535c", label: "Quotes" }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 h-full">
      <h3 className="text-lg font-semibold mb-2">Daily Engagement</h3>
      <div className="h-[calc(100%-40px)]">
        <ChartContainer config={config}>
          <BarChart data={data} width={window.innerWidth > 768 ? 400 : 300} height={220}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="likes" name="Likes" fill="#ff6b6b" />
            <Bar dataKey="retweets" name="Retweets" fill="#4ecdc4" />
            <Bar dataKey="replies" name="Replies" fill="#ffe66d" />
            <Bar dataKey="quotes" name="Quotes" fill="#1a535c" />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
