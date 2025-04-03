<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Project setup

```bash
$ cp .env.example .env
$ docker compose up -d
```

## How will you structure relationships between users, API keys, shortened URLs, and analytics?

I would put them in one document or use a relational database

## How will you ensure efficient lookups, particularly for redirects and analytics?

Using indexes on tables

## How will you enforce constraints like unique aliases and rate limits per user?

I used nanoid that provides uniq ids, otherwise I would need to lookup the db after generating a new url and keep doing it until I have a unique one.
Rate limits connected to API keys, I stored in redis and the value expires in a day.
