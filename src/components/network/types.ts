
export interface NetworkNode {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  followers?: number;
  following?: number;
  x?: number; // Adding optional x coordinate for positioning
  y?: number; // Adding optional y coordinate for positioning
  verified?: boolean; // Add verified status
  profile_color?: string; // Add profile color
  influence_score?: number; // Add influence score
  category?: string; // Add category
  bio?: string; // Add bio
  location?: string; // Add location
}

export interface NetworkLink {
  source: string;
  target: string;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export interface Dimensions {
  width: number;
  height: number;
}
