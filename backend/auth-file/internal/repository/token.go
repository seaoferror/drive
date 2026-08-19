package repository

import (
	"backend/auth-file/internal/constant"
	"context"
	"log/slog"
)

func (r *Repository) SaveRefreshTokenJTIById(ctx context.Context, id, jti string) error {
	results := r.vclient.DoMulti(ctx,
		r.vclient.B().Hset().Key(id).FieldValue().FieldValue(jti, "1").Build(),
		r.vclient.B().Hexpire().Key(id).Seconds(constant.RefreshTokenTTL).Fields().Numfields(1).Field(jti).Build())
	for _, res := range results {
		if err := res.Error(); err != nil {
			slog.Error("fail to save jti or set field ttl", "err", err)
			return err
		}
	}
	return nil
}

func (r *Repository) RemoveRefreshTokenJTIById(ctx context.Context, id, jti string) error {
	result := r.vclient.Do(ctx, r.vclient.B().Hdel().Key(id).Field(jti).Build())

	if result.Error() != nil {
		slog.Error("fail to remove jti by id", "err", result.Error())
		return result.Error()
	}
	return nil
}

func (r *Repository) IsRefreshTokenJTIValid(ctx context.Context, id, jti string) (bool, error) {
	exists, err := r.vclient.Do(ctx, r.vclient.B().Hexists().Key(id).Field(jti).Build()).AsBool()
	if err != nil {
		slog.Error("fail to check if jti exists by id", "err", err)
		return false, err
	}
	return exists, nil
}
