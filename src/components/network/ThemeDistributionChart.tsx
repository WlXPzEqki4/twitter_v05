
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ThemeDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    id: string;
  }>;
  title: string;
  description?: string;
  onThemeSelect?: (themeId: string | null) => void;
  selectedThemeId?: string | null;
}

export const ThemeDistributionChart = ({
  data,
  title,
  description,
  onThemeSelect,
  selectedThemeId
}: ThemeDistributionChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Handle hover on pie segments
  const onMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onMouseLeave = () => {
    setActiveIndex(null);
  };
  
  // Handle click on pie segments
  const onPieClick = (data: any, index: number) => {
    if (onThemeSelect) {
      // If already selected, deselect
      if (selectedThemeId === data.payload.id) {
        onThemeSelect(null);
      } else {
        onThemeSelect(data.payload.id);
      }
    }
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{payload[0].value} tweets</p>
          <p className="text-xs text-gray-600">Click to focus</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={1}
                dataKey="value"
                nameKey="name"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onPieClick}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke={selectedThemeId === entry.id ? "#000" : "none"}
                    strokeWidth={selectedThemeId === entry.id ? 2 : 0}
                    style={{
                      filter: activeIndex === index ? "brightness(1.1) drop-shadow(0px 0px 5px rgba(0,0,0,0.3))" : "none",
                      cursor: "pointer"
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
