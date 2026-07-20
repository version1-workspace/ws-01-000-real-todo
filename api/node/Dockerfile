FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Prisma generate resolves DATABASE_URL from prisma.config.ts, but does not connect to DB.
# Runtime DATABASE_URL is provided by compose/env_file and overrides this build-time dummy.
ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5432/real_todo?schema=public"
RUN DATABASE_URL="$DATABASE_URL" npm run prisma:generate
RUN npm run build
# tsx コマンドも使えるようにするため、devDependenciesもインストールしておく。
# RUN npm prune --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
