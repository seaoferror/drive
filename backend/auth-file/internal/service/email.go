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

	emailVerified, phoneNumberVerified, id, dbPassword, role, err :=
		s.repository.FindLoginInfoByEmail(email)
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

	if !emailVerified {
		resp.VerificationId, err = s.sendEmailOTP(email)
		if err != nil {
			return nil, "", ErrInternalServer
		}
		return &resp, "", nil
	}

	if !phoneNumberVerified {
		sid := uuid.New()
		err = s.repository.SaveEmailBySessionId(gocql.UUID(sid), email)
		if err != nil {
			return nil, "", ErrInternalServer
		}
		resp.SessionId = sid
		return &resp, "", nil
	}

	jti, err := gocql.RandomUUID()
	if err != nil {
		slog.Error("fail to create random uuid for jti")
		return nil, "", ErrInternalServer
	}
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
