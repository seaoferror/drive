export interface SignInWithEmailRequest {
  email: string;
  password: string;
}

export interface LoginWithEmailResponse {
  accessToken: string;
}