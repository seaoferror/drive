package service

import "errors"

var (
	ErrLoginWithEmail = errors.New("email or password is(are) incorrect")
	ErrGenerateToken  = errors.New("fail to generate new access token")
	ErrFailToSignOut  = errors.New("fail to sign out")

	ErrInternalServer = errors.New("something went wrong")
)
