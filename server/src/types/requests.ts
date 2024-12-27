export interface UserRegisterRequest {
  fName: string;
  lName: string;
  email: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}
