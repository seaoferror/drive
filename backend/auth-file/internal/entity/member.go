package entity

import (
	"github.com/google/uuid"
)

type Member struct {
	Id       uuid.UUID `db:"id"`
	Email    string    `db:"email"`
	Password string    `db:"password"`
	Name     string    `db:"name"`
	Role     string    `db:"role"`
	GroupId  string    `db:"group_id"`
}
