set -e
OPERATION=$1
DATABASE_URL="mysql://root:password@127.0.0.1:3306/todo_golang_development"
MIGRATION_DIR="internal/ent/migrate/migrations"

if [ "$OPERATION" == "apply" ]; then
    echo "Running migrations..."
    atlas migrate apply \
    --dir "file://$MIGRATION_DIR" \
    --url $DATABASE_URL
elif [ "$OPERATION" == "status" ]; then
    echo "list status..."
    atlas migrate status \
    --dir "file://$MIGRATION_DIR" \
    --url $DATABASE_URL
elif [ "$OPERATION" == "down" ]; then
    echo "down..."
    atlas migrate down \
    --dir "file://$MIGRATION_DIR" \
    --url $DATABASE_URL \
    --dev-url "docker://mysql/8/ent"
elif [ "$OPERATION" == "gen" ]; then
    echo "Generate migration files..."
    FILENAME=$2
    if [[ -z "$FILENAME" ]]; then
        echo "Please provide a filename to generate migrations."
        echo "Usage: ./migrate.sh gen <filename>"
        exit 1
    fi
    atlas migrate diff $FILENAME \
    --dir "file://$MIGRATION_DIR" \
    --to "ent://internal/ent/schema" \
    --dev-url "docker://mysql/8/ent"
elif [ "$OPERATION" == "hash" ]; then
    echo "Re-hash migrations..."
    atlas migrate hash $FILENAME \
    --dir "file://$MIGRATION_DIR"
elif [ "$OPERATION" == "rm" ]; then
    echo "remove migration..."
    FILENAME=$2
    if [[ -z "$FILENAME" ]]; then
        echo "Please provide a filename to remove migrations."
        echo "Usage: ./migrate.sh rm <filename>"
        exit 1
    fi
    atlas migrate rm $FILENAME \
    --dir "file://$MIGRATION_DIR"
else
    echo "Invalid operation. Please use [apply|gen]."
    exit 1
fi
