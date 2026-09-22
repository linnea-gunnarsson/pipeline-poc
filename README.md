# Todo App

A minimal web todo app backed by PostgreSQL. It supports adding and listing todo
items. Database data is intentionally ephemeral and is cleared whenever the
PostgreSQL container is recreated.

## Run

```sh
docker compose up --build
```

Open http://localhost:3000. Stop the application with `Ctrl+C`.
