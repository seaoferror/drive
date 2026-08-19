package service

import (
	"backend/auth-file/internal/repository"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"log"
	"os"
)

type Service struct {
	repository   *repository.Repository
	privateKeyAT *rsa.PrivateKey
	privateKeyRT *rsa.PrivateKey
	publicKeyRT  *rsa.PublicKey
}

func NewService(r *repository.Repository) *Service {
	return &Service{
		repository:   r,
		privateKeyAT: loadRSAPrivateKey("cert/authentication/private-key-at.pem"),
		privateKeyRT: loadRSAPrivateKey("cert/authentication/private-key-rt.pem"),
		publicKeyRT:  loadRSAPublicKey("cert/authentication/public-key-rt.pem"),
	}
}

func loadRSAPrivateKey(filepath string) *rsa.PrivateKey {
	keyBytes, err := os.ReadFile(filepath)
	if err != nil {
		log.Panicf("failed to read private key file: %v", err)
	}

	block, _ := pem.Decode(keyBytes)
	if block == nil {
		log.Panic("failed to decode PEM block from file")
	}

	privateKey, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		log.Panicf("failed to parse RSA private key: %v", err)
	}

	return privateKey
}

func loadRSAPublicKey(filepath string) *rsa.PublicKey {
	keyBytes, err := os.ReadFile(filepath)
	if err != nil {
		log.Panicf("failed to read public key file: %v", err)
	}

	block, _ := pem.Decode(keyBytes)
	if block == nil {
		log.Panic("failed to decode PEM block from file")
	}

	pubInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		log.Panicf("failed to parse RSA public key: %v", err)
	}

	publicKey, ok := pubInterface.(*rsa.PublicKey)
	if !ok {
		log.Panic("key is not an RSA public key")
	}
	return publicKey
}
