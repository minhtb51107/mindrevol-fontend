import React from 'react';
import { Link } from 'react-router-dom';
// [FIX] Sửa đường dẫn import từ '../ui/avatar' thành './avatar' hoặc '@/components/ui/avatar'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'; 

interface UserAvatarLinkProps {
  userId: string;
  avatarUrl?: string;
  fullname?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl'; 
}

export const UserAvatarLink: React.FC<UserAvatarLinkProps> = ({
  userId,
  avatarUrl,
  fullname,
  className = "",
  size = "md"
}) => {
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-32 w-32"
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
  };

  // Safe check
  const displayName = fullname || "User";
  const displayInitial = displayName.charAt(0)?.toUpperCase() || "?";

  if (!userId) {
     return (
        <Avatar className={`${sizeClasses[size]} ${className}`}>
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback>{displayInitial}</AvatarFallback>
        </Avatar>
     );
  }

  return (
    <Link 
      to={`/profile/${userId}`} 
      onClick={handleClick} 
      className={`inline-block transition-opacity hover:opacity-90 ${className}`}
    >
      <Avatar className={`${sizeClasses[size]} w-full h-full`}>
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback>{displayInitial}</AvatarFallback>
      </Avatar>
    </Link>
  );
};