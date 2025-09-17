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

## Example Requests

### Create a New Order
**POST** `/orders`  
Body:
```json
{ "customer": "Dell", "status": "Processing" }

Response:
```json
{ "id": 1, "customer": "Dell", "status": "Processing" }

### Get All Orders
**GET** `/orders`  
Response:
```json
  { "id": 1, "customer": "Dell", "status": "Processing" }

### Get Order by ID
**GET** `/orders/1`
Response:
```json
{ "id": 1, "customer": "Dell", "status": "Processing" }

### Update an Order
**PUT** `/orders/1` 
Body:
```json
{ "status": "Shipped" }

Response:
```json
{ "id": "1", "status": "Shipped" }