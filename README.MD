# Order Tracking API

A simple Node.js + Express API connected to SQLite for managing customer orders.  
Built to refresh my backend development skills and demonstrate API/database integration.  

## Features
- Create new orders (POST)
- View all orders (GET)
- View order by ID (GET)
- Update order status (PUT)
- Data persisted in SQLite

## Tech Stack
- Node.js
- Express.js
- SQLite
- Thunder Client (for testing in VS Code)

## Run Locally
1. Clone the repo  
   ```bash
   git clone https://github.com/ryankrabbe/order-tracking-api.git
   cd order-tracking-api

2. Install Dependencies
    ```bash
    npm install

3. Start Server
    ```bash
    node server.js

4. API available at http://localhost:3000