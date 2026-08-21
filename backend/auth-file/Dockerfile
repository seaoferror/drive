FROM golang:1.26.0 AS stage1
RUN apt-get update && apt-get install -y ca-certificates
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY auth-file/ auth-file/
RUN cd auth-file && CGO_ENABLED=0 GOOS=linux go build -o /auth-file .

FROM scratch
COPY --from=stage1 /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=stage1 /auth-file /auth-file
CMD ["/auth-file"]