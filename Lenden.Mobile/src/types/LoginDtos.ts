export interface UserRegisterDto {
  email: string | null;
  fullName: string;
  googleId: string;
  pictureUrl: string;
}

export interface UserLoginDto {
  email: string | null;
  googleId: string;
}
