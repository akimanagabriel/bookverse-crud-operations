const db = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

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
app.get("/book", async (req, res) => {
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

app.listen(6000, () => {
  console.log("Server running on port 6000 ");
});
