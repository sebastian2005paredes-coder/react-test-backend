const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const productsRoutes = require("./routes/products.routes");
const ordersRoutes = require("./routes/orders.routes");
const orderProductsRoutes = require("./routes/orderProducts.routes");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/orders", orderProductsRoutes);

app.get("/", (req, res) => {
    res.json({ message: "API Running" });
});

module.exports = app;