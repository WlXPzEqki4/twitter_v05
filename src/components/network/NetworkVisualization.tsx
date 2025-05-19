import { useRef, useCallback, useEffect, forwardRef, ForwardedRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { NetworkData, NetworkNode, Dimensions } from "./types";

interface NetworkVisualizationProps {
  networkData: NetworkData;
  dimensions: Dimensions;
  rootUserId: string;
  onNodeClick: (node: NetworkNode) => void;
  compact?: boolean;
  initialZoom?: number; 
  userColors?: Record<string, string>;
}

export const NetworkVisualization = forwardRef((
  {
    networkData,
    dimensions,
    rootUserId,
    onNodeClick,
    compact = false,
    initialZoom = 1,
    userColors = {}
  }: NetworkVisualizationProps,
  ref: ForwardedRef<any>
) => {
  // Create a local ref that we'll use internally
  const localGraphRef = useRef<any>(null);
  
  // Apply initial zoom and focus when component mounts or data changes
  useEffect(() => {
    if (networkData.nodes.length > 0) {
      // Short timeout to ensure the graph is rendered before zooming
      const timer = setTimeout(() => {
        // Get the actual DOM node - could be from either the forwarded ref or local ref
        const graphInstance = localGraphRef.current;
        if (graphInstance) {
          // Center graph on the root node
          const rootNode = networkData.nodes.find(node => node.id === rootUserId);
          if (rootNode && typeof rootNode.x === 'number' && typeof rootNode.y === 'number') {
            // Only center if x and y coordinates exist
            graphInstance.centerAt(rootNode.x, rootNode.y, 1000);
            graphInstance.zoom(initialZoom, 1000);
          } else {
            // If no coordinates or root node not found, fit the graph to view
            graphInstance.zoomToFit(400, 100);
            graphInstance.zoom(initialZoom, 1000);
          }
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [networkData, rootUserId, initialZoom]);
  
  // Single node rendering function - one circle only, no layering
  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isRootNode = node.id === rootUserId;
    
    // Calculate node size based on influence score
    const baseSize = isRootNode ? (compact ? 6 : 8) : (compact ? 4 : 6);
    const influenceScale = node.influence_score ? Math.min(node.influence_score / 5, 2) : 1;
    const nodeSize = baseSize * influenceScale;
    
    // Get node color - with proper priority order to ensure consistency
    let nodeColor;
    if (isRootNode) {
      // Root node is always purple
      nodeColor = "#8B5CF6";
    } else if (userColors && userColors[node.id]) {
      // Next priority is the user-specific color mapping
      nodeColor = userColors[node.id];
    } else if (node.profile_color && node.profile_color !== "null" && node.profile_color !== "undefined") {
      // Then use profile color if available
      nodeColor = node.profile_color;
    } else {
      // Default fallback color
      nodeColor = "#7E69AB";
    }
    
    // Draw single circle - no background circles
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
    ctx.fillStyle = nodeColor;
    ctx.fill();
    
    // Add verified badge if needed
    if (node.verified) {
      ctx.beginPath();
      ctx.arc(node.x + nodeSize - 1, node.y - nodeSize + 1, 2, 0, 2 * Math.PI);
      ctx.fillStyle = "#1DA1F2";
      ctx.fill();
    }
    
    // Add username label if zoomed in enough
    if (globalScale >= 0.8 && node.username && !compact) {
      const fontSize = isRootNode ? 5 : 4;
      const label = `@${node.username}`;
      
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Background for text
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth + 4, fontSize + 2].map(n => n + 2 * 0.5);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y + nodeSize + 1,
        bckgDimensions[0],
        bckgDimensions[1]
      );
      
      // Text
      ctx.fillStyle = 'white';
      ctx.fillText(label, node.x, node.y + nodeSize + fontSize);
    }
  }, [rootUserId, compact, userColors]);
  
  // Handle node drag events
  const handleNodeDrag = useCallback((node: any) => {
    // Set fx and fy to fix the position of the node
    node.fx = node.x;
    node.fy = node.y;
  }, []);
  
  // Handle drag end events
  const handleNodeDragEnd = useCallback((node: any) => {
    // Keep the node fixed at its current position after drag
    node.fx = node.x;
    node.fy = node.y;
  }, []);
  
  return (
    <ForceGraph2D
      ref={localGraphRef}
      graphData={networkData}
      nodeLabel={(node: any) => `${node.name} (@${node.username})${node.verified ? ' ✓' : ''}`}
      nodeCanvasObject={paintNode}
      nodeRelSize={compact ? 4 : 8}
      linkColor={() => "#d6bcfa"}
      linkWidth={compact ? 1 : 1.5}
      linkDirectionalParticles={compact ? 0 : 1}
      linkDirectionalParticleWidth={1}
      onNodeClick={onNodeClick}
      onNodeDrag={handleNodeDrag}
      onNodeDragEnd={handleNodeDragEnd}
      cooldownTicks={100}
      width={dimensions.width}
      height={dimensions.height}
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.2}
      warmupTicks={compact ? 50 : 100}
    />
  );
});

// Add a display name for better debugging
NetworkVisualization.displayName = "NetworkVisualization";
