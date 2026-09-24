const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: databaseUrl });

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;"
  })[character]);
}

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

app.get("/", async (_request, response, next) => {
  try {
    const { rows } = await pool.query("SELECT id, title FROM todos ORDER BY id DESC");
    const todoItems = rows.map(({ id, title }) =>
      `<li><span>${escapeHtml(title)}</span><small>#${id}</small></li>`
    ).join("");

    response.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Todos</title>
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <main>
      <h1>Todos</h1>
      <form action="/todos" method="post">
        <label for="title">New todo</label>
        <div class="form-row">
          <input id="title" name="title" required maxlength="255" autofocus>
          <button type="submit">Add</button>
        </div>
      </form>
      <ul>${todoItems || "<li class=\"empty\">No todos yet.</li>"}</ul>
    </main>
  </body>
</html>`);
  } catch (error) {
    next(error);
  }
});

app.post("/todos", async (request, response, next) => {
  const title = request.body.title?.trim();

  if (!title) {
    return response.redirect(303, "/");
  }

  try {
    await pool.query("INSERT INTO todos (title) VALUES ($1)", [title]);
    response.redirect(303, "/");
  } catch (error) {
    next(error);
  }
});

// Deliberately vulnerable routes for local security tooling exercises.
app.get("/lab/sql-search", async (request, response, next) => {
  const query = request.query.q || "";

  try {
    const { rows } = await pool.query(
      `SELECT id, title FROM todos WHERE title ILIKE '%${query}%' ORDER BY id DESC`
    );
    response.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get("/lab/echo", (request, response) => {
  const message = request.query.message || "";
  response.type("html").send(`<h1>Lab echo</h1><p>${message}</p>`);
});

app.get("/lab/todo", async (request, response, next) => {
  const id = request.query.id;

  try {
    const { rows } = await pool.query("SELECT id, title FROM todos WHERE id = $1", [id]);
    if (!rows[0]) {
      return response.status(404).json({ error: "Todo not found" });
    }

    response.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

initializeDatabase()
  .then(() => app.listen(port, () => console.log(`Todo app listening on port ${port}`)))
  .catch((error) => {
    console.error("Unable to initialize database", error);
    process.exit(1);
  });