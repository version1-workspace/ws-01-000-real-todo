# ws-01-000-real-todo


## How to Run

### Frontend

```
cd frontend/core
npm install
npm run dev
```

### Backend

```
cd api
npm install
npm run start
```
# ws-01-000-real-todo


## How To Run

### Frontend

```
cd frontend/core
npm install
npm run dev
```

### Backend

```
cd api
npm install
npm run db:setup
npm run start:dev
```


## Deploy

### Frontend

- Netlify

### Backend

- Heroku

#### Migration & Seed on Prod

```
heroku ps:exec -a version1-real-todo

export AUTH_SECRET= \
export AUTH_SUGAR= \
export DATABASE_HOST=  \
export DATABASE_USERNAME=  \
export DATABASE_NAME= \
export DATABASE_PASSWORD=

npm run db:setup
```

#### Check log

```
heroku logs -a version1-real-todo
```
