import { useState, useEffect } from 'react';
import { journeyService } from '../services/journey.service';
import { friendService } from '@/modules/user/services/friend.service'; 

export const useInviteMembers = (journeyId: string) => {
  const [friends, setFriends] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [invitedIds, setInvitedIds] = useState<number[]>([]);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const res: any = await friendService.getMyFriends();
        // SỬA LỖI: Kiểm tra xem res là mảng hay là object Page chứa content
        if (Array.isArray(res)) {
            setFriends(res);
        } else if (res && res.content && Array.isArray(res.content)) {
            setFriends(res.content);
        } else {
            setFriends([]);
        }
      } catch (err) {
        console.error("Failed to load friends", err);
        setFriends([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadFriends();
  }, []);

  const inviteUser = async (friendId: number) => {
    try {
      await journeyService.inviteFriend(journeyId, friendId);
      setInvitedIds(prev => [...prev, friendId]);
    } catch (err: any) {
      alert("Lỗi khi mời: " + (err.response?.data?.message || err.message));
    }
  };

  return { friends, isLoading, invitedIds, inviteUser };
};