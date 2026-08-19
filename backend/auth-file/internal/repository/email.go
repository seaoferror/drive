package repository

import (
	"context"

	"github.com/google/uuid"
)

func (r *Repository) FindLoginInfoByEmail(ctx context.Context, email string) (id uuid.UUID, password string, role string, err error) {
	err = r.pool.QueryRow(ctx, `SELECT id, password, role FROM member WHERE email = $1`, email).Scan(&id, &password, &role)
	return id, password, role, err
}
