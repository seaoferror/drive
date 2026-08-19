package controller

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"time"
)

func tokenRouter(n *Controller) {
	n.Router(POST, "/auth-file/refresh-token", n.refreshToken)
	n.Router(POST, "/auth-file/account/logout", n.logout)
}

func (c *Controller) refreshToken(w http.ResponseWriter, r *http.Request) {
	rt, err := r.Cookie("refresh_token")
	if err != nil {
		handleError(w, err)
		return
	}
	result, err := c.service.GenerateAccessToken(r.Context(), rt.Value)
	if err != nil {
		handleError(w, err)
		return
	}
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(result)
	if err != nil {
		slog.Error("fail to write response body",
			"err", err)
	}
}

func (c *Controller) logout(w http.ResponseWriter, r *http.Request) {
	rt, err := r.Cookie("refresh_token")
	if err != nil {
		handleError(w, err)
		return
	}
	err = c.service.RemoveJTI(r.Context(), rt.Value)
	http.SetCookie(w, &http.Cookie{Name: "refresh_token",
		Value:    "",
		Expires:  time.Now(),
		Path:     "/",
		Domain:   "",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
	})
	w.WriteHeader(http.StatusOK)
}
