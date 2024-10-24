set -e
OPERATION=$1
DATABASE_URL="mysql://root:@127.0.0.1:3306/todo_golang_development"

if [ "$OPERATION" == "apply" ]; then
    echo "Running migrations..."
    atlas migrate apply \
    --dir "file://ent/migrate/migrations" \
    --url $DATABASE_URL
elif [ "$OPERATION" == "gen" ]; then
    echo "Generate migration files..."
    FILENAME=$2
    if [[ -z "$FILENAME" ]]; then
        echo "Please provide a filename to generate migrations."
        echo "Usage: ./migrate.sh gen <filename>"
        exit 1
    fi
    atlas migrate diff $FILENAME \
    --dir "file://ent/migrate/migrations" \
    --to "ent://ent/schema" \
    --dev-url "docker://mysql/8/ent"
else
    echo "Invalid operation. Please use [apply|gen]."
    exit 1
fi
