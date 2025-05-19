
import { useDailyStats } from "@/hooks/twitter";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { CHART_COLORS } from "@/hooks/twitter/use-color-palette";

interface ActivityTimelineProps {
  userId: string;
}

export const ActivityTimeline = ({ userId }: ActivityTimelineProps) => {
  const { data: stats, isLoading, error } = useDailyStats(userId, 7);

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (error || !stats?.length) {
    return <div className="text-red-500">Error loading activity data</div>;
  }

  // Format dates to be more readable
  const data = stats.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }));

  // Use the centralized color palette
  const config = {
    tweetCount: { color: CHART_COLORS.elonmusk, label: "Tweets" },
    views: { color: CHART_COLORS.nasa, label: "Views (K)" }
  };

  // Format view counts to be in thousands for better readability
  const formattedData = data.map(day => ({
    ...day,
    views: Math.round(day.views / 1000)
  }));

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 h-full">
      <h3 className="text-lg font-semibold mb-2">Activity Timeline</h3>
      <div className="text-xs text-muted-foreground mb-2">
        User ID: {userId}
      </div>
      <div className="h-[calc(100%-40px)]">
        <ChartContainer config={config}>
          <AreaChart data={formattedData} width={window.innerWidth > 768 ? 400 : 300} height={220}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="tweetCount" 
              name="Tweets" 
              stroke={CHART_COLORS.elonmusk}
              fill={CHART_COLORS.elonmusk}
              fillOpacity={0.2} 
              yAxisId="left"
            />
            <Area 
              type="monotone" 
              dataKey="views" 
              name="Views (K)" 
              stroke={CHART_COLORS.nasa}
              fill={CHART_COLORS.nasa}
              fillOpacity={0.2}
              yAxisId="right"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};
