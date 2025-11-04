export interface UserRegisterDto {
  authProvider?: string;
  email: string | null;
  fullName: string;
  googleId: string;
  pictureUrl: string;
  password?: string;
}

export interface UserLoginDto {
  authProvider?: string;
  email: string | null;
  googleId: string;
  password?: string;
}
