export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  language: string;
  password: string;
}
export interface NewUser {
  email: string;
  password: string;
  language: string;
  first_name: string;
  last_name: string;
}
