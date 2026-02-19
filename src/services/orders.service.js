const db = require("../config/db");
const { calculateItemTotal, calculateOrderTotal } = require("../utils/calculations");

exports.getOrders = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                o.id,
                o.order_number,
                o.date,
                o.status,
                o.final_price,
                COUNT(op.id) AS product_count
            FROM orders o
            LEFT JOIN order_products op ON o.id = op.order_id
            GROUP BY o.id
        `;
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.getOrderById = (id) => {
    return new Promise((resolve, reject) => {
        const orderQuery = "SELECT * FROM orders WHERE id = ?";
        db.query(orderQuery, [id], (err, orders) => {
            if (err) return reject(err);
            if (orders.length === 0) return resolve(null);

            const productsQuery = `
                SELECT 
                    op.id,
                    p.name,
                    op.qty,
                    op.unit_price,
                    op.total_price
                FROM order_products op
                JOIN products p ON op.product_id = p.id
                WHERE op.order_id = ?
            `;
            db.query(productsQuery, [id], (err, products) => {
                if (err) return reject(err);
                resolve({ ...orders[0], products });
            });
        });
    });
};

exports.createOrder = (orderData) => {
    return new Promise((resolve, reject) => {
        const { order_number, products } = orderData;

        const orderQuery = `INSERT INTO orders (order_number, date) VALUES (?, CURDATE())`;
        db.query(orderQuery, [order_number], (err, result) => {
            if (err) return reject(err);

            const orderId = result.insertId;

            if (!products || products.length === 0) {
                return resolve({ message: "Order created without products" });
            }

            const productIds = products.map(p => p.product_id);
            db.query("SELECT id, unit_price FROM products WHERE id IN (?)", [productIds], (err, dbProducts) => {
                if (err) return reject(err);

                const itemsToInsert = products.map(p => {
                    const dbProduct = dbProducts.find(dp => dp.id === p.product_id);
                    const total_price = calculateItemTotal(dbProduct.unit_price, p.qty);
                    return [orderId, p.product_id, p.qty, dbProduct.unit_price, total_price];
                });

                db.query(
                    "INSERT INTO order_products (order_id, product_id, qty, unit_price, total_price) VALUES ?",
                    [itemsToInsert],
                    (err) => {
                        if (err) return reject(err);

                        db.query("SELECT total_price FROM order_products WHERE order_id = ?", [orderId], (err, rows) => {
                            if (err) return reject(err);

                            const final_price = calculateOrderTotal(rows);
                            db.query("UPDATE orders SET final_price = ? WHERE id = ?", [final_price, orderId], (err) => {
                                if (err) return reject(err);
                                resolve({ message: "Order created" });
                            });
                        });
                    }
                );
            });
        });
    });
};

exports.updateOrder = (id, orderData) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT status FROM orders WHERE id = ?", [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error("Order not found"));
            if (results[0].status === "Completed") return reject(new Error("Completed orders cannot be modified"));

            db.query("UPDATE orders SET order_number = ? WHERE id = ?", [orderData.order_number, id], (err) => {
                if (err) return reject(err);
                resolve({ message: "Order updated" });
            });
        });
    });
};

exports.updateOrderStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE orders SET status = ? WHERE id = ?", [status, id], (err) => {
            if (err) return reject(err);
            resolve({ message: "Status updated" });
        });
    });
};

exports.deleteOrder = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT status FROM orders WHERE id = ?", [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error("Order not found"));
            if (results[0].status === "Completed") return reject(new Error("Completed orders cannot be deleted"));

            db.query("DELETE FROM orders WHERE id = ?", [id], (err) => {
                if (err) return reject(err);
                resolve({ message: "Order deleted" });
            });
        });
    });
};