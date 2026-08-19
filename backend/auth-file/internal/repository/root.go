package repository

import (
	"context"
	"log"
	"log/slog"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	pool *pgxpool.Pool
}

func NewRepository() *Repository {
	pool, err := pgxpool.New(context.Background(), os.Getenv("POSTGRES_URL"))
	if err != nil {
		slog.Error("failed to connect postgres", "err", err)
		panic(err)
	}
	queries := []string{
		`CREATE TABLE IF NOT EXISTS member (
			id UUID PRIMARY KEY, email TEXT, password TEXT, role TEXT, refresh_token_jtis UUID[]
		);`,
	}
	for _, q := range queries {
		_, err = pool.Exec(context.Background(), q)
		if err != nil {
			slog.Error("failed to execute migration query", "err", err, "query", q)
			panic(err)
		}
	}
	log.Print("success to connect postgres")
	r := &Repository{
		pool: pool,
	}

	return r
}
