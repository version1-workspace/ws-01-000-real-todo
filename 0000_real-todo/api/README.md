## Real Todo API


### Setup


#### Dependencies

```
- node
- docker
```


```bash
npm install
docker-compose up -d # run mysql8
# create database `todo_development` on mysql
npm run db:setup
npm run db:seed
npm run start:dev
```
