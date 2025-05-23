const pool = require("./db");
const session = require("express-session");
const express = require("express");
const cors = require("cors");
const route = require("./authentication");
const auth = require("./middleware");

const app = express();

// configure express session
app.use(session({ secret: "mykey-123" }));

app.use(cors()); // accept request client's request
app.use(express.json()); // read data from a clients

// join authentication  with created app
app.use(route);

// insert
app.post("/book", async (req, res) => {
  //   const data = req.body;
  const { title, author, genre, price, instock } = req.body;
  const sql =
    "INSERT INTO books (title, author, genre, price, instock) VALUES(?,?,?,?,?)";
  await pool.query(sql, [title, author, genre, price, instock]);
  res.send("New book created");
});

// read all books
app.get("/book", auth, async (req, res) => {
  const [books] = await pool.query("SELECT * FROM books");
  res.send(books);
});

// read a single book by id
app.get("/book/:idx", async (req, res) => {
  const { idx } = req.params;
  const [[book]] = await pool.query("SELECT * FROM books where id= ?", [idx]);
  if (!book) return res.status(404).send("No book available with specified id");
  res.send(book);
});

// update book by id
app.patch("/book/:id", async (req, res) => {
  const { title, author, genre, price, instock } = req.body;
  const { id } = req.params;
  const sql =
    "UPDATE books SET title = ?, author = ?, genre = ?, price = ?, instock = ? WHERE id = ?";
  await pool.query(sql, [title, author, genre, price, instock, id]);
  res.send("Book modified successfully!");
});

// delete book by id
app.delete("/book/:id", async (req, res) => {
  const { id } = req.params;
  const [[book]] = await pool.query("SELECT * FROM books where id= ?", [id]);
  if (!book) return res.status(404).send("No book available with specified id");

  await pool.query("DELETE FROM books WHERE id = ? ", [id]);
  res.send("Book deleted!");
});

app.use((req, res) => {
  res.status(404).send("Route not fount in this application");
});

app.listen(5000, () => console.log("server running on port 5000"));
