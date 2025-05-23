const db = require("./db");
const express = require("express");
const cors = require("cors");
const route = require("./authentication");
const session = require("express-session");
const auth = require("./middleware");

const app = express();
app.use(
  session({
    secret: "my_secret_key",
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 5 },
  })
);
app.use(express.json());

// enable authentication routes
app.use(route);
// insert new book
app.post("/book", async (req, res) => {
  const data = req.body;
  const sql =
    "INSERT INTO books (title, author, genre, instock, price) VALUES (?,?,?,?,?)";
  await db.query(sql, [
    data.title,
    data.author,
    data.genre,
    data.instock,
    data.price,
  ]);

  res.send("New book created successfully!");
});

// display all books
app.get("/book", auth, async (req, res) => {
  const [books] = await db.query("SELECT * FROM books");
  res.send(books);
});

// display a single by id
app.get("/book/:idx", async (req, res) => {
  const id = req.params.idx;
  const [[book]] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
  if (!book) return res.status(404).send("No book found");
  res.send(book);
});

// update book by id
app.put("/book/:id", async (req, res) => {
  const { title, author, genre, instock, price } = req.body;
  const sql =
    "UPDATE books SET title = ?, author = ?, genre = ?, instock = ? , price = ? WHERE id = ? ";
  await db.query(sql, [title, author, genre, instock, price, req.params.id]);
  res.send("Book updated !");
});

// delete book by id
app.delete("/book/:bookId", async (req, res) => {
  await db.query("delete FROM books WHERE id = ?", [req.params.bookId]);
  res.send("Book removed !");
});

app.use((req, res) => {
  res.status(404).send("Rouute not found in our application");
});

app.listen(6000, () => {
  console.log("Server running on port 6000 ");
});
