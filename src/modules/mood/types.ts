export interface MoodReactionResponse {
    userId: string;
    fullname: string; 
    avatarUrl: string; 
    emoji: string;
}

export interface MoodResponse {
    id: string;
    boxId: string;
    userId: string;
    fullname: string; 
    avatarUrl: string; 
    icon: string;
    message: string;
    spotifyTrackId?: string;
    activity?: string;
    location?: string;
    weather?: string;
    createdAt: string;
    expiresAt: string;
    reactions: MoodReactionResponse[];
}

export interface MoodRequest {
    icon: string;
    message?: string;
    spotifyTrackId?: string;
    activity?: string;
    location?: string;
    weather?: string;
}