package controller

import (
	"backend/auth-file/internal/constant"
	"backend/auth-file/internal/dto"
	"encoding/json"
	"log/slog"
	"net/http"
	"time"
)

func emailRouter(n *Controller) {
	n.Router(POST, "/auth-file/email/login", n.loginWithEmail)
}

func (c *Controller) loginWithEmail(w http.ResponseWriter, r *http.Request) {
	var req dto.SignInWithEmailRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		handleError(w, err)
		return
	}
	result, rt, err := c.service.LoginWithEmail(req.Email, req.Password)
	if err != nil {
		handleError(w, err)
		return
	}
	if rt != "" {
		http.SetCookie(w, &http.Cookie{Name: "refresh_token",
			Value:    rt,
			Expires:  time.Now().Add(constant.RefreshTokenTTL * time.Second),
			Path:     "/",
			Domain:   "",
			HttpOnly: true,
			Secure:   true,
		})
	}
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(result)
	if err != nil {
		slog.Error("fail to write response body",
			"err", err)
	}
}
