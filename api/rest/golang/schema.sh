set -e
OPERATION=$1

if [ "$OPERATION" == "new" ]; then
    echo "Generate schema"
    SCHEMANAME=$2
    if [[ -z "$SCHEMANAME" ]]; then
        echo "Please provide a schema name to generate."
        echo "Usage: ./schema.sh new <schemaname>"
        exit 1
    fi
    go run -mod=mod entgo.io/ent/cmd/ent \
      new $SCHEMANAME --target internal/ent/schema
elif [ "$OPERATION" == "gen" ]; then
  go generate ./internal/ent
else
  echo "Invalid operation. Please use [new|gen]."
  exit 1
fi
