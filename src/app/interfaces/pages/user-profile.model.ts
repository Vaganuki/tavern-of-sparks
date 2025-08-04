export interface UserProfile {
  username: string;
  colorIdentity: string | null;
  pronouns: string | null;
  avatar: string | null;
  createdAt: string;
}

export interface UserProfileResponse {
  user: UserProfile;
  isOwnProfile: boolean;
  canEdit: boolean;
}
