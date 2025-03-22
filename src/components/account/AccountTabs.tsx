
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, UserCog } from 'lucide-react';
import OrderHistory from './OrderHistory';
import ProfileSettings from './ProfileSettings';

export default function AccountTabs() {
  const [activeTab, setActiveTab] = useState("orders");
  
  return (
    <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="orders" className="flex items-center gap-2">
          <User size={16} />
          <span>Order History</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <UserCog size={16} />
          <span>Profile Settings</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="orders" className="mt-0">
        <OrderHistory />
      </TabsContent>
      
      <TabsContent value="settings" className="mt-0">
        <ProfileSettings />
      </TabsContent>
    </Tabs>
  );
}
