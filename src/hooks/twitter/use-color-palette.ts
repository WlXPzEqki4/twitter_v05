
// Central color palette to ensure consistency across all visualizations
// Maps usernames to specific colors for consistent representations

import { connectionUsernames } from "./use-connection-usernames";

// Define a vibrant, consistent color palette for visualizations
export const CHART_COLORS = {
  // Primary colors for main users
  primary: "#8B5CF6", // Vivid Purple (for Elon Musk)
  secondary: "#7E69AB", // Secondary Purple
  tertiary: "#6E59A5", // Tertiary Purple
  
  // Colors as shown in the screenshot
  elonmusk: "#8B5CF6",   // Purple for Elon Musk
  spacex: "#F472B6",     // Pink for SpaceX
  tesla: "#10B981",      // Green for Tesla
  nasa: "#0EA5E9",       // Blue for NASA
  dogecoin: "#F97316",   // Orange for Dogecoin
  jeffbezos: "#FBBF24",  // Yellow/Amber for Jeff Bezos
  neuralink: "#6366F1",  // Indigo for Neuralink
  jack: "#71717A",       // Gray for Jack
  gwynneshortwell: "#94A3B8", // Slate for Gwynne Shotwell
  pmarca: "#475569",     // Dark Gray for pmarca
  starlink: "#64748B",   // Blue Gray for Starlink
  xengineering: "#52525B", // Gray for X Engineering
  sama: "#78716C",       // Stone for Sam Altman
  cathiewood: "#78716C", // Stone for Cathie Wood
  boringcompany: "#F97316", // Orange for Boring Company
};

// Define username to color mappings for consistency
export const USER_COLOR_MAPPINGS: Record<string, string> = {
  // Main users with fixed colors based on the screenshot
  "elonmusk": CHART_COLORS.elonmusk,
  "SpaceX": CHART_COLORS.spacex,
  "spacex": CHART_COLORS.spacex, // Lowercase variant
  "Tesla": CHART_COLORS.tesla,
  "tesla": CHART_COLORS.tesla, // Lowercase variant
  "NASA": CHART_COLORS.nasa,
  "nasa": CHART_COLORS.nasa, // Lowercase variant
  "dogecoin": CHART_COLORS.dogecoin,
  "JeffBezos": CHART_COLORS.jeffbezos,
  "jeffbezos": CHART_COLORS.jeffbezos, // Lowercase variant
  "neuralink": CHART_COLORS.neuralink,
  "boringcompany": CHART_COLORS.boringcompany,
  "jack": CHART_COLORS.jack,
  "xengineering": CHART_COLORS.xengineering,
  "starlink": CHART_COLORS.starlink,
  "pmarca": CHART_COLORS.pmarca,
  "sama": CHART_COLORS.sama,
  "cathiedwood": CHART_COLORS.cathiewood,
  "gwynneshortwell": CHART_COLORS.gwynneshortwell,
};

/**
 * Map a connection ID to a consistent color based on the username
 * @param connectionId Connection ID or UUID
 * @returns A consistent color for the connection
 */
export const getConnectionColor = (connectionId: string): string => {
  // Check if this is a connection ID that maps to a username
  const username = connectionUsernames[connectionId];
  
  // If we have a username and it's in our color mappings, use that color
  if (username && USER_COLOR_MAPPINGS[username]) {
    return USER_COLOR_MAPPINGS[username];
  }
  
  // Generate a consistent color based on the connection ID
  // by taking the sum of char codes modulo the length of CHART_COLORS
  const charSum = connectionId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorKeys = Object.keys(CHART_COLORS);
  return CHART_COLORS[colorKeys[charSum % colorKeys.length] as keyof typeof CHART_COLORS];
};

/**
 * Get a color for a username, ensuring consistency across components
 * @param username Twitter username
 * @returns A consistent color for the username
 */
export const getUsernameColor = (username?: string): string => {
  if (!username) return CHART_COLORS.primary;
  
  // If we have a predefined color for this username, use it
  if (USER_COLOR_MAPPINGS[username]) {
    return USER_COLOR_MAPPINGS[username];
  }
  
  // Generate a consistent color based on the username
  const charSum = username.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorKeys = Object.keys(CHART_COLORS);
  return CHART_COLORS[colorKeys[charSum % colorKeys.length] as keyof typeof CHART_COLORS];
};
