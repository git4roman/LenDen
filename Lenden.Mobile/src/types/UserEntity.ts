export interface UserEntity {
  id: number;
  googleId: string;
  email: string;
  fullName: string;
  givenName: string | null;
  pictureUrl: string;
  emailVerified: boolean;
  createdAt: string;
  isActive: boolean;
  role: "user" | "admin"; // Assuming other roles might exist
  userGroups: any[]; // The structure of UserGroup is not provided, so 'any[]' is used.
}
