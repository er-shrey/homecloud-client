export interface ILoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface IUser {
  userId: number;
  role: string;
  iat: string;
  exp: string;
}
