import express from "express";
import { connectToDb, db } from "./database/db.js";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import { SECRET_KEY } from "./secretkey.js";
const app = express();

// Parse JSON bodies for login API
app.use(bodyParser.json());

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Missing required key",
    });
  }
  // Check username and password against the database
  const existingUser = db.users.find(
    (u) => u.username === username && u.password == password
  );
  if (!existingUser) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  } else {
    // Generate token

    const jwtPayLoad = {
      username: existingUser.username,
    };
    const token = jwt.sign(jwtPayLoad, SECRET_KEY, {
      expiresIn: "1000s",
    });
    res.json({
      user: jwtPayLoad,
      accessToken: token,
    });
  }
});

// Middleware to validate token
const authenticateToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  console.log(token);
  if (!token) {
    return res.status(400).json({
      message: "Token is not provided",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log(decoded);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      error,
    });
  }
};

app.get("/api/inventory", (req, res) => {
  const query = { instock: { $lt: 100 } };
  db.inventories.find(query).toArray((err, result) => {
    if (err) {
      console.error("Error retrieving inventory:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(result);
      console.log(result);
    }
  });
});

// Apply middleware to the protected API endpoint
app.get("/api/orders", authenticateToken, (req, res) => {
  db.orders.find(
    {}.toArray((err, result) => {
      if (err) throw err;
      res.json(result);
    })
  );
});

app.listen(3000, () => {
  console.log("App is running at 3000");
  connectToDb();
});
