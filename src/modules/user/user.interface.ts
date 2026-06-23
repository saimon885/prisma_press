export interface CreateUser {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
}
export interface LoginUser {
  email: string;
  password: string;
}
