
import { useState, useEffect } from "react";
import { UserSelector } from "@/components/UserSelector";
import { ProfileCard } from "@/components/ProfileCard";
import { ThemesDistribution } from "@/components/ThemesDistribution";
import { EngagementStats } from "@/components/EngagementStats";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { TweetList } from "@/components/TweetList";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkGraph } from "@/components/NetworkGraph";

const Index = () => {
  // Use Elon Musk's ID as the default
  const [selectedUserId, setSelectedUserId] = useState<string>("d1fb883c-a2c1-4e5f-8c1d-f7a21c409d0a");
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    // Show a toast notification when the dashboard initially loads
    toast({
      title: "Dashboard Loaded",
      description: "Twitter analytics data is ready to view",
    });
  }, []);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    toast({
      title: "Profile Selected",
      description: "Loading analytics data for the selected profile",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-black">Network-Centric Twitter Narrative Monitoring Dashboard</h1>
          <div className="flex flex-col space-y-2">
            <label htmlFor="user-selector" className="text-sm font-medium">
              Select Profile to Analyze
            </label>
            <UserSelector onUserSelect={handleUserSelect} selectedUserId={selectedUserId} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="text-base px-6">Handle Overview</TabsTrigger>
            <TabsTrigger value="network" className="text-base px-6">Handle Network</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile card and themes */}
              <div className="lg:col-span-1 space-y-6">
                <ProfileCard userId={selectedUserId} />
                <ThemesDistribution userId={selectedUserId} />
              </div>
              
              {/* Main content area */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-80">
                    <ActivityTimeline userId={selectedUserId} />
                  </div>
                  <div className="h-80">
                    <EngagementStats userId={selectedUserId} />
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <TweetList userId={selectedUserId} />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="network" className="w-full">
            <div className="w-full bg-white rounded-lg shadow-md">
              <NetworkGraph userId={selectedUserId} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
