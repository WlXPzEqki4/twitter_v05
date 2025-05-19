
import { useEffect, useRef, useState } from "react";
import { NetworkNode } from "./types";
import { NetworkVisualization } from "./NetworkVisualization";
import { NodeDetailPanel } from "./NodeDetailPanel";
import { useNetworkData } from "./hooks/useNetworkData";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet } from "@/components/ui/sheet";
import { NetworkTimelineContainer } from "./NetworkTimelineContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNetworkFeed } from "./hooks/useNetworkFeed";

interface NetworkGraphContainerProps {
  userId: string;
  userColors?: Record<string, string>;
  onTimeRangeSelect?: (startDate: string | null, endDate: string | null) => void;
}

export const NetworkGraphContainer = ({ 
  userId, 
  userColors = {},
  onTimeRangeSelect 
}: NetworkGraphContainerProps) => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("graph");
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 }); // Set initial dimensions
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Fetch network data
  const { data: networkData, isLoading, error } = useNetworkData(userId);

  // Fetch network feed data to get user colors
  const { data: feedData } = useNetworkFeed(userId, 30);
  
  // Create a mapping of user IDs to colors
  const feedUserColors = feedData?.userTweetCounts.reduce((colors, user) => {
    if (user.color) {
      colors[user.userId] = user.color;
    }
    return colors;
  }, {} as Record<string, string>) || {};
  
  // Debug log to verify colors are being extracted properly
  console.log("NetworkGraphContainer - User colors mapping:", userColors);
  console.log("NetworkGraphContainer - Feed user colors:", feedUserColors);
  
  // Combine passed-in userColors with ones from our feed data
  // Using spread to ensure passed-in colors take precedence
  const combinedUserColors = { ...feedUserColors, ...userColors };
  
  // Update dimensions on component mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 800,
          height: activeTab === "graph" ? 800 : 500
        });
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Add resize listener
    window.addEventListener("resize", updateDimensions);
    
    // Force update dimensions after a delay to ensure container is properly sized
    const timer = setTimeout(() => {
      updateDimensions();
    }, 300);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(timer);
    };
  }, [activeTab, containerRef.current]);

  // Handle tab change
  useEffect(() => {
    // Force update dimensions when tab changes
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth || 800,
        height: activeTab === "graph" ? 800 : 500
      });
    }
  }, [activeTab]);

  const handleNodeClick = (node: NetworkNode) => {
    // Update the selected node and show the panel
    setSelectedNode(node);
    setShowPanel(true);
  };

  const onSheetClose = () => {
    setShowPanel(false);
  };
  
  // Handle timeline selection
  const handleTimelineSelection = (start: string | null, end: string | null) => {
    if (onTimeRangeSelect) {
      onTimeRangeSelect(start, end);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[800px] w-full" />;
  }

  if (error || !networkData || !networkData.nodes || networkData.nodes.length === 0) {
    return (
      <div className="h-[800px] w-full border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
        <div className="text-center p-4">
          <h3 className="font-medium text-lg text-red-500">Network data could not be loaded</h3>
          <p className="text-gray-500 text-sm mt-2">Please try again later or select another user</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full border rounded-lg overflow-hidden bg-gray-50">
      {networkData && (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
            <TabsList>
              <TabsTrigger value="graph">Network Graph</TabsTrigger>
              <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
            </TabsList>
            
            <div className="absolute top-4 right-4 z-10 bg-white/70 backdrop-blur-sm p-2 rounded-md text-sm">
              <p className="font-medium">Network for {networkData.nodes[0]?.name}</p>
              <ul className="text-xs text-gray-600 mt-1">
                <li>• Click a node to see details</li>
                {activeTab === "graph" ? (
                  <>
                    <li>• Drag nodes to reposition</li>
                    <li>• Scroll to zoom in/out</li>
                  </>
                ) : (
                  <li>• Drag on chart to select time range</li>
                )}
              </ul>
            </div>
            
            <TabsContent value="graph" className="mt-2">
              <NetworkVisualization 
                networkData={networkData}
                dimensions={dimensions}
                onNodeClick={handleNodeClick}
                rootUserId={userId}
                initialZoom={2.5}
                userColors={combinedUserColors}
              />
            </TabsContent>
            
            <TabsContent value="timeline" className="mt-2 space-y-4 p-2">
              <NetworkVisualization 
                networkData={networkData}
                dimensions={{ width: dimensions.width, height: 300 }}
                onNodeClick={handleNodeClick}
                rootUserId={userId}
                compact={true}
                userColors={combinedUserColors}
              />
              
              <NetworkTimelineContainer 
                userId={userId} 
                timeRange={30}
                userColors={combinedUserColors}
                onTimeRangeSelect={handleTimelineSelection}
              />
            </TabsContent>
          </Tabs>
          
          <Sheet open={showPanel} onOpenChange={setShowPanel}>
            <NodeDetailPanel selectedNode={selectedNode} onClose={onSheetClose} />
          </Sheet>
        </>
      )}
    </div>
  );
};

