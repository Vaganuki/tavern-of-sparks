export interface UserProfile {
  username: string;
  colorIdentity: string;
  pronouns: string;
  avatar: string | null;
  createdAt: string;
  email?: string;
  lastName?: string;
  firstName?: string;
  birthdate?: string;
  id?: number;
}

export interface UserProfileResponse {
  user: UserProfile;
  isOwnProfile: boolean;
  canEdit: boolean;
}
