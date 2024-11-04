package main

import (
	"context"
	"log"
	"time"
	"version1-workspace/ws-01-000-real-todo/internal/db"
	appdb "version1-workspace/ws-01-000-real-todo/internal/db"
	"version1-workspace/ws-01-000-real-todo/internal/ent"
)

func main() {
	cfg := db.NewConfig()
	db := cfg.MustOpen()
	defer db.Close()

	client := appdb.NewClient(db, true)
	defer client.Close()

	ctx := context.Background()
	if err := seed(ctx, client); err != nil {
		log.Fatalf("failed to seed: %v", err)
	}
}

func seed(ctx context.Context, client *appdb.Client) error {
	if err := appdb.WithTx(ctx, client.Get(),
		func(tx *ent.Tx) error {
			u, err := tx.User. // UserClient.
						Create(). // User create builder.
						SetUsername("Steven").
						SetEmail("steven.stephens@example.com").
						SetPasswordDigest("password_digest").
						SetRefreshToken("refresh_token").
						SetStatus("active").
						Save(ctx)
			if err != nil {
				return err
			}

			list := []*ent.ProjectCreate{
				tx.Project.Create().
					SetUserID(u.ID).
					SetName("プログラミング").
					SetSlug("programming").
					SetGoal("プログラミングのスキルを向上させる").
					SetShouldbe("毎日 GitHub に草を生やす").
					SetDeadline(time.Now().AddDate(0, 0, 30)).
					SetStatus("active"),
				tx.Project.Create().
					SetUserID(u.ID).
					SetName("英語").
					SetSlug("english").
					SetGoal("英検 1 級に合格する").
					SetShouldbe("毎日過去問を解く").
					SetDeadline(time.Now().AddDate(0, 0, 30)).
					SetStatus("active"),
				tx.Project.Create().
					SetUserID(u.ID).
					SetName("プライベート").
					SetSlug("private").
					SetGoal("年内に海外旅行をする").
					SetDeadline(time.Now().AddDate(0, 0, 30)).
					SetStatus("active"),
			}

			_, err = tx.Project.CreateBulk(list...).Save(ctx)
			return err
		}); err != nil {
		return err
	}
	return nil
}
