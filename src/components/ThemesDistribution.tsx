
import { useThemeAnalysis } from "@/hooks/twitter";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Cell, Pie, PieChart, Sector, ResponsiveContainer } from "recharts";
import { useState } from "react";

interface ThemesDistributionProps {
  userId: string;
}

export const ThemesDistribution = ({ userId }: ThemesDistributionProps) => {
  const { data: themeAnalysis, isLoading, error } = useThemeAnalysis(userId);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (error || !themeAnalysis?.length) {
    return <div className="text-red-500">Error loading theme data</div>;
  }

  const data = themeAnalysis.map(item => ({
    name: item.theme.name,
    value: item.tweetCount,
    color: item.theme.color || "#000000",
  }));

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const config = data.reduce((acc, item) => {
    acc[item.name] = { 
      color: item.color,
      label: item.name 
    };
    return acc;
  }, {} as Record<string, { color: string, label: string }>);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4">Themes Distribution</h3>
      <div className="h-64">
        <ChartContainer config={config}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend />
          </PieChart>
        </ChartContainer>
      </div>
    </div>
  );
};
