export interface CreateUser {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
}

export interface IupdatePrfile {
  profilePhoto?: string;
  bio?: string;
}
