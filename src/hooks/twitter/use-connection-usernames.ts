
// Updated and complete mapping of connection IDs to usernames
// Maps both UUID format and connection-X format to usernames
export const connectionUsernames: Record<string, string> = {
  // Connection ID format
  "connection-0": "spacex", // Lower case version
  "connection-1": "tesla",
  "connection-2": "dogecoin",
  "connection-3": "neuralink",
  "connection-4": "boringcompany",
  "connection-5": "jeffbezos",
  "connection-6": "nasa",
  "connection-7": "GwynneShotwell", // Correct capitalization
  "connection-8": "jack",
  "connection-9": "xengineering",
  "connection-10": "starlink",
  "connection-11": "pmarca",
  "connection-12": "sama",
  "connection-13": "cathiedwood",
  
  // Upper case / official versions
  "connection-0-alt": "SpaceX", 
  "connection-1-alt": "Tesla",
  "connection-6-alt": "NASA",
  "connection-5-alt": "JeffBezos",
  "connection-8-alt": "jack", // Same capitalization
  "connection-7-alt": "GwynneShotwell", // Correct capitalization
  
  // UUID format
  "d1fb883c-a2c1-4e5f-8c1d-f7a21c409d0a": "elonmusk",
  "85afc34f-96eb-40ec-946b-408cc1cd067f": "SpaceX", // Updated exact SpaceX ID from database
  "b10fd02c-7b44-4bbe-9555-e40573846b5f": "tesla",
  "f4ca80a1-6e7f-4cf5-8597-8edad5b4381a": "nasa",
  "982aefb2-bd53-44ce-ac4b-65801cfaf406": "dogecoin",
  "50334bc2-7d21-4387-82d4-e869039f2a6f": "jeffbezos",
  "686caf44-3691-41e8-96c4-b6a5cb0b277f": "neuralink",
  "1905cb88-f9c9-485e-b1d3-ef82ba45709a": "jack", 
  "9f56a8a0-31af-4d7f-a9a6-18aa57222c66": "GwynneShotwell", // FIXED: This ID now maps to GwynneShotwell
  "0294cff0-3f41-4b9a-9852-931c397f4388": "pmarca", 
  "45022183-ffb3-4941-b921-56f38bee737c": "GwynneShotwell", // Using proper capitalization to match database exactly
  "44b57de8-bc9d-4e02-9ce2-33e3ce6471b0": "starlink",
  "fa4627f3-8fed-458f-8f20-eb035f0fb1aa": "xengineering",
  "88bc0d2c-98ad-4aba-8f58-f3404d629554": "sama", // Sam Altman
  "b39d09ec-4290-4647-8cbf-e81408ccace0": "cathiedwood"
};
