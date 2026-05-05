import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useChatStore } from '@/modules/chat/store/useChatStore';
import { journeyService } from "@/modules/journey/services/journey.service";
import { friendService } from '@/modules/user/services/friend.service'; 
import { toast } from 'react-hot-toast'; 

import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { NotificationPanel } from './NotificationPanel';
import { DesktopHeader } from './DesktopHeader';

interface NavigationProps {
  onCheckinClick: (file: File | null) => void;
  onJourneyClick: () => void;
  onSettingsClick?: () => void; 
  refreshTrigger?: number;
  
  isSidebarExpanded?: boolean;
  toggleSidebar?: () => void;
  setSidebarExpanded?: (expanded: boolean) => void; 
  hideBottomNav?: boolean; 
  
  myJourneys?: any[];
  activeJourneyId?: string | null;
  onCreateJourneyClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  onCheckinClick, 
  onJourneyClick, 
  onSettingsClick, 
  refreshTrigger,
  isSidebarExpanded = true,
  toggleSidebar = () => {},
  setSidebarExpanded,
  hideBottomNav = false,
  
  myJourneys = [],
  activeJourneyId = null,
  onCreateJourneyClick
}) => {
  
  const location = useLocation();
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const [friendsList, setFriendsList] = useState<any[]>([]);

  const conversations = useChatStore((state) => state.conversations);
  const totalUnread = useMemo(() => {
    return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
  }, [conversations]);

  const [hasJourneyAlerts, setHasJourneyAlerts] = useState(false);
  
  const checkJourneyAlerts = async () => {
    try {
      const data = await journeyService.getAlerts();
      const hasAlert = (data.journeyPendingInvitations > 0) || (data.waitingApprovalRequests > 0);
      setHasJourneyAlerts(hasAlert);
    } catch (error) {
      console.error("Failed to check journey alerts", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const data = await friendService.getMyFriends();
      const formattedFriends = data.map((item) => ({
        id: item.friend.id,
        name: item.friend.fullname,
        avatarUrl: item.friend.avatarUrl
      }));
      setFriendsList(formattedFriends);
    } catch (error) {
      console.error("Failed to fetch friends for sidebar", error);
    }
  };

  useEffect(() => {
    checkJourneyAlerts();
    fetchFriends(); 
    
    const interval = setInterval(checkJourneyAlerts, 30000);
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  const triggerUpload = () => {
      onCheckinClick(null);
  };

  const handleNotificationClick = () => {
      setIsNotificationPanelOpen(!isNotificationPanelOpen);
  };

  const viewProps = {
    onJourneyClick,
    triggerUpload, 
    totalUnread,
    hasJourneyAlerts,
    onSettingsClick,
    myJourneys,
    activeJourneyId,
    onCreateJourneyClick
  };

  return (
    <>
      {!hideBottomNav && (
          <MobileBottomNav {...viewProps} />
      )}
      
      <DesktopSidebar 
        {...viewProps} 
        isExpanded={isSidebarExpanded} 
        toggleSidebar={toggleSidebar} 
        onNotificationClick={handleNotificationClick} 
        isNotificationOpen={isNotificationPanelOpen}  
        friends={friendsList} 
      />

      <DesktopHeader 
        isSidebarExpanded={isSidebarExpanded}
        onNotificationClick={handleNotificationClick}
        totalUnread={totalUnread}
      />

      <NotificationPanel 
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </>
  );
};