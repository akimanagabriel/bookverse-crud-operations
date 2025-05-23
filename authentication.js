const route = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("./db");
const auth = require("./middleware");
// registration
route.post("/register", async (req, res) => {
  const { username, password, fullnames } = req.body;
  //   encrypt password
  const encPassword = await bcrypt.hash(password, 10);
  // verify if a username is not exist
  const [isExist] = await db.query("select * from admins where username = ? ", [
    username,
  ]);
  if (isExist.length > 0) {
    return res.send("Username already taken");
  }
  //register
  await db.query(
    "INSERT INTO admins (username, fullnames, password) VALUES (?,?,?)",
    [username, fullnames, encPassword]
  );
  res.send("New account created");
});

// admin login
route.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [[admin]] = await db.query("SELECT * FROM admins WHERE username = ? ", [
    username,
  ]);

  if (admin) {
    // verify a passoword
    const isMatch = await bcrypt.compare(password, admin.password);
    if (isMatch) {
      //store data in the session variables
      delete admin.password;
      req.session.user = admin;
      res.send("User authenticated successfully");
    } else {
      res.send("Incorrect password");
    }
  } else {
    return res.status(404).send("Incorrect username");
  }
});

// logout
route.post("/logout", (req, res) => {
  req.session.destroy();
  return res.send("User logged out !");
});

// view admin profile
route.get("/profile", auth, (req, res) => {
  const user = req.session.user;
  res.send(user);
});

module.exports = route;
