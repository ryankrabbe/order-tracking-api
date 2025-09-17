const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

// Connect to SQLite DB
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error("❌ DB connection error:", err.message);
  else console.log("✅ Connected to SQLite database.");
});

// Create orders table if not exists
db.run(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer TEXT,
  status TEXT
)`);

// Routes

// Get all orders
app.get("/orders", (req, res) => {
  db.all("SELECT * FROM orders", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get order by ID
app.get("/orders/:id", (req, res) => {
  db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Order not found" });
    res.json(row);
  });
});

// Add new order
app.post("/orders", (req, res) => {
  const { customer, status } = req.body;
  db.run("INSERT INTO orders (customer, status) VALUES (?, ?)", 
    [customer, status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, customer, status });
    });
});

// Update order status
app.put("/orders/:id", (req, res) => {
  const { status } = req.body;
  db.run("UPDATE orders SET status = ? WHERE id = ?", 
    [status, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Order not found" });
      res.json({ id: req.params.id, status });
    });
});

app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));