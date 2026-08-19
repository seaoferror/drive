package dto

type SignInWithEmailRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginWithEmailResponse struct {
	AccessToken string `json:"accessToken,omitempty"`
}
