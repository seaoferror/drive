package service

import (
	"backend/auth-file/internal/dto"
	"errors"
	"log/slog"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func (s *Service) LoginWithEmail(email, password string) (*dto.LoginWithEmailResponse, string /*refreshToken*/, error) {
	var resp dto.LoginWithEmailResponse

	id, dbPassword, role, err := s.repository.FindLoginInfoByEmail(email)
	if err != nil {
		return nil, "", errors.New("this account does not exist")
	}

	err = bcrypt.CompareHashAndPassword([]byte(dbPassword), []byte(password))
	if err != nil {
		slog.Info("invalid password",
			"err", err,
		)
		return nil, "", ErrLoginWithEmail
	}

	jti := uuid.New()
	at, rt, err := s.createLoginTokens(id.String(), jti.String(), role)
	if err != nil {
		return nil, "", ErrInternalServer
	}
	err = s.repository.SaveRefreshTokenJTIById(id, jti)
	if err != nil {
		return nil, "", ErrInternalServer
	}
	resp.AccessToken = at
	return &resp, rt, nil
}
