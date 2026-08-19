package service

import (
	"backend/auth-file/internal/dto"
	"context"
	"errors"
	"log/slog"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func (s *Service) LoginWithEmail(ctx context.Context, email, password string) (*dto.LoginWithEmailResponse, string, error) {
	var resp dto.LoginWithEmailResponse

	id, dbPassword, role, err := s.repository.FindLoginInfoByEmail(ctx, email)
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
	rawId := id.String()
	rawJTI := jti.String()
	at, rt, err := s.createLoginTokens(rawId, rawJTI, role)
	if err != nil {
		return nil, "", ErrInternalServer
	}
	err = s.repository.SaveRefreshTokenJTIById(ctx, rawId, rawJTI)
	if err != nil {
		return nil, "", ErrInternalServer
	}
	resp.AccessToken = at
	return &resp, rt, nil
}
