
## Command


## DB

### Gen Schema

```bash
go run -mod=mod entgo.io/ent/cmd/ent new User
```

### Migrate

generate
```bash
atlas migrate diff migration_name \
  --dir "file://ent/migrate/migrations" \
  --to "ent://ent/schema" \
  --dev-url "docker://mysql/8/ent"
```

apply

```bash
atlas migrate apply \
  --dir "file://ent/migrate/migrations" \
  --url "mysql://root:@127.0.0.1:3306/todo_golang_development"
```
