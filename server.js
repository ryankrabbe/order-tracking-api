const VALID_STATUSES = ["CREATED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const ALLOWED_TRANSITIONS = {
  CREATED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: []
};

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

  const VALID_STATUSES = ["CREATED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  const ALLOWED_TRANSITIONS = {
    CREATED: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: []
  };

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status"
    });
  }

  db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, order) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const currentStatus = order.status;

    if (!ALLOWED_TRANSITIONS[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${currentStatus} to ${status}`
      });
    }

    db.run(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });

        res.json({
          success: true,
          data: {
            id: req.params.id,
            previousStatus: currentStatus,
            newStatus: status
          }
        });
      }
    );
  });
});


app.listen(3000, () => console.log("🚀 Server running at http://localhost:3000"));