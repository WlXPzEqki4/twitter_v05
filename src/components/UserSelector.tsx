
import { useState } from "react";
import { useUsers } from "@/hooks/twitter";
import { User } from "@/types/twitter";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface UserSelectorProps {
  onUserSelect: (userId: string) => void;
  selectedUserId?: string;
}

export const UserSelector = ({ onUserSelect, selectedUserId }: UserSelectorProps) => {
  const { data: users, isLoading, error } = useUsers();
  
  if (isLoading) {
    return <Skeleton className="h-9 w-[180px]" />;
  }
  
  if (error || !users?.length) {
    return <div className="text-red-500">Error loading users</div>;
  }

  // Set default selection to the first user if none selected
  if (!selectedUserId && users.length > 0) {
    setTimeout(() => onUserSelect(users[0].id), 0);
  }

  return (
    <Select 
      value={selectedUserId} 
      onValueChange={onUserSelect}
      defaultValue={users[0]?.id}
    >
      <SelectTrigger id="user-selector" className="w-[180px]">
        <SelectValue placeholder="Select a profile" />
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            {user.display_name} (@{user.username})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
