
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NarrativeDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    id: string;
    themeColor: string;
    themeName: string;
  }>;
  title: string;
  description?: string;
  onNarrativeSelect?: (narrativeId: string | null) => void;
  selectedNarrativeId?: string | null;
}

export const NarrativeDistributionChart = ({
  data,
  title,
  description,
  onNarrativeSelect,
  selectedNarrativeId
}: NarrativeDistributionChartProps) => {
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
    if (onNarrativeSelect) {
      // If already selected, deselect
      if (selectedNarrativeId === data.payload.id) {
        onNarrativeSelect(null);
      } else {
        onNarrativeSelect(data.payload.id);
      }
    }
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{payload[0].value} tweets</p>
          <p className="text-xs text-gray-600">Theme: {payload[0].payload.themeName}</p>
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
                    stroke={selectedNarrativeId === entry.id ? "#000" : "none"}
                    strokeWidth={selectedNarrativeId === entry.id ? 2 : 0}
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
