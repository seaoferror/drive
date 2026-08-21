package repository

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"log"
	"log/slog"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/valkey-io/valkey-go"
)

type Repository struct {
	pool    *pgxpool.Pool
	vclient valkey.Client
}

func NewRepository() *Repository {
	pool, err := pgxpool.New(context.Background(), "postgresql://"+os.Getenv("POSTGRES_URL"))
	if err != nil {
		slog.Error("failed to connect postgres", "err", err)
		panic(err)
	}

	clientOption := valkey.ClientOption{
		InitAddress: []string{os.Getenv("VALKEY_ADDRESS")},
	}
	tlsConfig, err := CreateTlSConfig("", "", os.Getenv("VALKEY_CA_CERT_PATH"))
	if err != nil {
		log.Panicf("fail to create tls config for valkey")
	}
	tlsConfig.ServerName = os.Getenv("VALKEY_HOST")
	clientOption.TLSConfig = tlsConfig

	clientOption.Username = os.Getenv("VALKEY_USERNAME")
	clientOption.Password = os.Getenv("VALKEY_PASSWORD")
	vclient, err := valkey.NewClient(clientOption)
	if err != nil {
		log.Panicf("Fail to connect to valkey: %v", err)
	}
	log.Print("success to connect valkey")
	log.Print("success to connect postgres")
	r := &Repository{
		pool:    pool,
		vclient: vclient,
	}

	return r
}

func CreateTlSConfig(certFile, keyFile, caCertFile string) (tlsConfig *tls.Config, err error) {
	tlsConfig = &tls.Config{InsecureSkipVerify: false}
	if certFile != "" {
		clientCert, err1 := tls.LoadX509KeyPair(certFile, keyFile)
		if err1 != nil {
			return nil, fmt.Errorf("failed to load client cert/key: %w", err1)
		}
		tlsConfig.Certificates = []tls.Certificate{clientCert}
	}
	if caCertFile != "" {
		caCert, err2 := os.ReadFile(caCertFile)
		if err2 != nil {
			return nil, fmt.Errorf("failed to read CA cert: %w", err2)
		}
		caCertPool := x509.NewCertPool()
		if ok := caCertPool.AppendCertsFromPEM(caCert); !ok {
			return nil, fmt.Errorf("failed to append CA cert to pool")
		}
		tlsConfig.RootCAs = caCertPool
	}
	return tlsConfig, nil
}
