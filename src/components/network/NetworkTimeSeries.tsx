
import { useState, useCallback, Fragment } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  BarChart,
  Bar,
  Legend
} from "recharts";
import { format, parseISO } from "date-fns";
import { DailyTweets } from "./hooks/useNetworkFeed";
import { UserTweetCount } from "./hooks/useNetworkFeed";
import { CHART_COLORS } from "@/hooks/twitter/use-color-palette";

interface NetworkTimeSeriesProps {
  data: DailyTweets[];
  onTimeRangeSelect: (startDate: string, endDate: string) => void;
  selectedNode?: string | null;
  viewMode: "line" | "stackedBar";
  userColors: Record<string, string>;
  userData: UserTweetCount[];
}

export const NetworkTimeSeries = ({ 
  data, 
  onTimeRangeSelect,
  selectedNode,
  viewMode,
  userColors,
  userData
}: NetworkTimeSeriesProps) => {
  const [brushing, setBrushing] = useState(false);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<{start: string, end: string} | null>(null);
  
  // Format dates for display
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd')
  }));
  
  // Handle brush start
  const handleMouseDown = useCallback((e: any) => {
    if (!e) return;
    setBrushing(true);
    setStartIndex(e.activeTooltipIndex);
  }, []);
  
  // Handle brushing movement
  const handleMouseMove = useCallback((e: any) => {
    if (!brushing || !e || startIndex === null || e.activeTooltipIndex === undefined) return;
    
    const start = Math.min(startIndex, e.activeTooltipIndex);
    const end = Math.max(startIndex, e.activeTooltipIndex);
    
    if (start >= 0 && end < data.length) {
      setSelectedRange({
        start: data[start].date,
        end: data[end].date
      });
    }
  }, [brushing, startIndex, data]);
  
  // Handle brush end
  const handleMouseUp = useCallback(() => {
    if (brushing && selectedRange) {
      onTimeRangeSelect(selectedRange.start, selectedRange.end);
    }
    setBrushing(false);
    setStartIndex(null);
  }, [brushing, selectedRange, onTimeRangeSelect]);
  
  // Handle reset of the brush
  const handleDoubleClick = useCallback(() => {
    setSelectedRange(null);
    onTimeRangeSelect('', '');
  }, [onTimeRangeSelect]);
  
  // Custom tooltip formatter for line chart
  const tooltipFormatter = (value: number, name: string) => {
    if (name === "All Tweets") {
      return [`${value} tweets`, 'Total Tweets'];
    }
    
    // Find the user with this ID to get their username for tooltip
    const user = userData.find(u => u.userId === name);
    return [`${value} tweets`, user ? user.username : name];
  };

  // Get active users who have tweeted, sorted by tweet count
  const activeUsers = userData
    .filter(user => user.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Limit to top 10 users to prevent visual overload

  // Function to render the appropriate chart based on viewMode
  const renderChart = () => {
    if (viewMode === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
              tickCount={7}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickMargin={10}
              allowDecimals={false}
            />
            <Tooltip 
              formatter={tooltipFormatter}
              labelFormatter={(label) => `Date: ${label}`}
            />
            
            {/* Highlighted selection */}
            {selectedRange && (
              <ReferenceArea
                x1={format(parseISO(selectedRange.start), 'MMM dd')}
                x2={format(parseISO(selectedRange.end), 'MMM dd')}
                strokeOpacity={0.3}
                fill={CHART_COLORS.elonmusk}
                fillOpacity={0.1}
              />
            )}
            
            <Area
              type="monotone"
              dataKey="count"
              name="All Tweets"
              stroke={CHART_COLORS.elonmusk}
              fill={CHART_COLORS.elonmusk}
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
    
    // For stacked bar chart - use our consistent colors
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{ top: 5, right: 20, left: 10, bottom: 25 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }}
            tickMargin={10}
            tickCount={7}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickMargin={10}
            allowDecimals={false}
          />
          <Tooltip 
            formatter={tooltipFormatter}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            iconSize={8}
            formatter={(value) => {
              // Find the user with this ID to get their username for legend
              const user = userData.find(u => u.userId === value);
              return user ? user.username : value;
            }}
          />
          
          {/* Render a stacked bar for each active user with consistent colors */}
          {activeUsers.map(user => (
            <Bar 
              key={user.userId}
              name={user.username}
              dataKey={(dataPoint) => dataPoint.userCounts[user.userId] || 0}
              stackId="a"
              fill={userColors[user.userId] || user.color || CHART_COLORS.primary}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="w-full h-[300px]">
      <div className="text-xs text-muted-foreground mb-2">
        {selectedRange ? (
          <span>Viewing data from {format(parseISO(selectedRange.start), 'MMM dd')} to {format(parseISO(selectedRange.end), 'MMM dd')} 
            <button 
              onClick={handleDoubleClick}
              className="ml-2 text-primary hover:text-primary/80 underline"
            >
              Reset view
            </button>
          </span>
        ) : (
          <span>Drag on the chart to zoom into a specific time range</span>
        )}
      </div>
      
      {renderChart()}
    </div>
  );
};
