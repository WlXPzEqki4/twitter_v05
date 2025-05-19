
import { useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SourceThemeData, ThemeSourceData } from "@/hooks/twitter/use-network-theme-analysis";

interface SourceThemeBreakdownProps {
  data: SourceThemeData[] | ThemeSourceData[];
  title: string;
  mode: "bySource" | "byTheme";
  selectedId?: string | null;
  onItemSelect?: (id: string | null) => void;
  maxBars?: number;
}

export const SourceThemeBreakdown = ({ 
  data, 
  title, 
  mode, 
  selectedId,
  onItemSelect,
  maxBars = 10
}: SourceThemeBreakdownProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Prepare the data for the chart
  const chartData = data
    .slice(0, maxBars)
    .map(item => {
      if (mode === "bySource") {
        const source = item as SourceThemeData;
        return {
          name: source.username || source.displayName,
          value: source.totalTweets,
          id: source.sourceId,
          displayName: source.displayName
        };
      } else {
        const theme = item as ThemeSourceData;
        return {
          name: theme.themeName,
          value: theme.totalTweets,
          id: theme.themeId,
          color: theme.themeColor
        };
      }
    });
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-md">
          <p className="font-medium">
            {mode === "bySource" ? "@" : ""}{payload[0].payload.name}
            {payload[0].payload.displayName && payload[0].payload.displayName !== payload[0].payload.name && 
              ` (${payload[0].payload.displayName})`}
          </p>
          <p className="text-sm">{payload[0].value} tweets</p>
          <p className="text-xs text-gray-600">Click to focus</p>
        </div>
      );
    }
    return null;
  };
  
  // Handle bar click
  const handleClick = (data: any) => {
    if (onItemSelect) {
      if (selectedId === data.id) {
        onItemSelect(null);
      } else {
        onItemSelect(data.id);
      }
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <div className={`w-full ${chartData.length > 5 ? 'min-h-[300px]' : 'min-h-[200px]'}`}>
            <ResponsiveContainer width="100%" height={Math.max(chartData.length * 50, 200)}>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                barGap={2}
              >
                <XAxis type="number" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={100} 
                  tickFormatter={(value) => {
                    return value.length > 10 ? `${value.substring(0, 10)}...` : value;
                  }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  onClick={handleClick}
                  onMouseEnter={(data) => setHoveredId(data.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={mode === "byTheme" ? entry.color : "#7E69AB"}
                      opacity={selectedId && selectedId !== entry.id ? 0.5 : 1}
                      stroke={selectedId === entry.id || hoveredId === entry.id ? "#000" : "none"}
                      strokeWidth={selectedId === entry.id || hoveredId === entry.id ? 1 : 0}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
